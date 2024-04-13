import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { BookInterface } from "../models/book.js";
import Book from "../models/book.js";
import readFile, {
	getBookFiles,
	getEPubRootFile,
	parseManifest,
} from "../utils/readFile.js";

interface BookReadRequest extends Request {
	bookData: BookInterface;
	chapterData: { id?: string; href?: string };
	bookManifest;
}

const verifyBookMiddleware = async (
	req: BookReadRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { bookId, chId } = req.params;

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
		})
			.populate("categories")
			.populate("author")
			.populate("cover");

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
		console.log(bookContainerURL);

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

		req.chapterData = fileData;
		req.bookManifest = manifest;

		next();
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};

export default verifyBookMiddleware;
