import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { BookInterface } from "../models/book.js";
import Book from "../models/book.js";
import readFile, {
	getBookFiles,
	getEPubRootFile,
	parseManifest,
	parseSpain,
	parseTOC,
} from "../utils/readFile.js";
import BookRead, { BookReadInterface } from "../models/bookRead.js";
import { auth } from "../middleware/general/auth.js";
import { allowedNodeEnvironmentFlags } from "process";

interface BookReadRequest extends Request {
	bookData: BookInterface;
	chapterData: { id?: string; href?: string };
	bookManifest;
	content;
	bookRead: null | BookReadInterface;
	auth: auth;
	allHTML;
}

const verifyBookMiddleware = async (
	req: BookReadRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { bookId, chId } = req.params;
		const { auth } = req;
		const user = auth.user;

		const { lang } = req.query;

		if (!bookId)
			res
				.status(400)
				.send(
					lang === "ar"
						? "من فضلك ادخل معرف الكتاب"
						: "please, enter the book id",
				);

		if (!mongoose.Types.ObjectId.isValid(bookId)) {
			res
				.status(400)
				.send(lang === "ar" ? "معرف الكتاب غير صالح" : "Invalid book id.");
		}

		const bookData: BookInterface | null = await Book.findOne({
			_id: bookId,
			status: "published",
		});

		if (bookData === null) {
			res
				.status(404)
				.send(lang === "ar" ? "هذا الكتاب غير موجود" : "Unfound book");
		}

		req.bookData = bookData;

		if (!bookData?.file) throw new Error("Book file didn't found");

		const allAssets = await getBookFiles(bookData);
		if (!allAssets?.length) throw new Error("Extarcted files didn't found");

		const bookContainerURL = allAssets.find((asset) =>
			asset.toLowerCase().includes("meta-inf/container.xml"),
		);
		console.log("bookContainerURL: ", bookContainerURL);

		if (!bookContainerURL) throw new Error("Container file didn't found");
		const { filename } = await getEPubRootFile(bookContainerURL);

		if (!filename) throw new Error("Content file didn't found");

		const contentFile = allAssets.find((asset) =>
			asset.toLowerCase().includes(filename),
		);
		if (!contentFile) throw new Error("Content file url didn't found");

		const { parsedData } = await readFile(contentFile);

		const manifest = parseManifest(
			allAssets,
			bookContainerURL,
			parsedData.manifest,
		);

		const extention = "application/xhtml+xml";
		const allHTML = Object.entries(manifest).filter(
			(f) =>
				f[1]?.["media-type"] === extention || f[1]?.["mediaType"] === extention,
		);
		console.log("allHTML: ", allHTML);

		if (chId !== "start" && chId !== "continue") {
			const fileData = manifest[chId];

			if (!fileData)
				res.status(404).json({
					message:
						lang === "ar"
							? "عفواً هذا الفصل غير موجود"
							: "Sorry, this chapter didn't found",
				});

			if (
				fileData?.mediaType !== extention &&
				fileData?.["media-type"] !== extention
			)
				res.status(404).json({
					message:
						lang === "ar"
							? "عفواً هذا المعرف ليس لفصل من الكتاب"
							: "Sorry, this id isn't for the book chapter",
				});

			const { contents, toc } = await parseSpain(
				parsedData.spine,
				bookContainerURL,
				manifest,
			);

			const realTOC = await parseTOC({ toc, contents }, manifest);
			req.content = realTOC;
			req.chapterData = fileData;
			req.bookManifest = manifest;
			req.bookRead = await BookRead.findOne({
				book: bookData._id,
				user: user._id,
			});
			req.allHTML = allHTML.map((e) => e[1]);
		} else {
			const bookRead = await BookRead.findOne({
				book: bookData._id,
				user: user._id,
			});
			console.log("Book read: ", bookRead);

			const bookReadContent = new Set(bookRead.content.map((e) => e.chId));

			console.log("book Sample: ", bookData.sample);
			if (
				bookRead &&
				bookData.price > 0 &&
				bookRead?.status !== "purchased" &&
				bookData.sample.every((s: string) => bookReadContent.has(s))
			) {
				res.status(400).json({
					message:
						lang === "ar"
							? "عفواَ لا يمكنك الوصل الى هذا الفصل"
							: "Sorry, you can't read this chapter",
				});
			}

			const chIdx =
				chId === "start"
					? 0
					: allHTML.length === bookRead.content.length
					? -1
					: allHTML.findIndex(
							([chIdx, chIData]) =>
								chIdx === bookRead.content[bookRead.content.length - 1].chId,
					  ) + 1;

			if (chIdx === -1) {
				res.status(200).json({
					content: "",
				});
			}

			const chData: [
				string,
				{
					href?: string;
					mediaType?: string;
					"media-type"?: string;
				},
			] = allHTML[chIdx];
			console.log("chData: ", chData);

			const { contents, toc } = await parseSpain(
				parsedData.spine,
				bookContainerURL,
				manifest,
			);
			console.log("contents: ", contents);

			const realTOC = await parseTOC({ toc, contents }, manifest);

			req.params.chId = chData[0];

			req.content = realTOC;
			req.chapterData = chData[1];
			req.bookManifest = manifest;
			req.bookRead = bookRead;
			req.allHTML = allHTML.map((e) => e[1]);
		}

		next();
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};

export default verifyBookMiddleware;
