import { Response, Request } from "express";
import { BookInterface } from "../models/book.js";
import readFile from "../utils/readFile.js";
import File from "../models/file.js";
import BookRead from "../models/bookRead.js";
import { auth } from "../middleware/general/auth.js";

interface ReadRequest extends Request {
	params: {
		bookId: string;
		chId: string;
	};
	bookData: BookInterface;
	chapterData: { id?: string; href?: string };
	bookManifest;
	auth: auth;
}

const readChapter = async (req: ReadRequest, res: Response) => {
	try {
		const { lang } = req.query;
		const { chId } = req.params;
		const { chapterData, bookData, bookManifest, auth } = req;
		const user = auth.user;

		const bookRead = await BookRead.findOne({
			book: bookData._id,
			user: user._id,
		});

		if (
			bookData.price > 0 &&
			bookRead?.status !== "purchased" &&
			!bookData.sample.includes(chId)
		)
			return res.status(400).json({
				message:
					lang === "ar"
						? "عفواَ لا يمكنك الوصل الى هذا الفصل"
						: "Sorry, you can't read this chapter",
			});

		const htmlContent = await readFile(chapterData.href);
		const manifestArray: Array<{ id: string; href: string }> =
			Object.values(bookManifest);

		const srcRegex = /src="([^"]*)"/g;
		const hrefRegex = /href="([^"]*)"/g;
		let srcValue;
		while ((srcValue = srcRegex.exec(htmlContent.content)) !== null) {
			const manifestData = manifestArray.find(
				(f) =>
					f?.href?.split("/")[f?.href?.split("/").length - 1] ===
					srcValue[1]?.split("/")[srcValue[1]?.split("/").length - 1],
			);
			const replacer = manifestData ? manifestData?.href : srcValue[1];
			htmlContent.content = htmlContent.content.replace(
				new RegExp(srcValue[1], "g"),
				replacer,
			);
		}

		let hrefValue;
		while ((hrefValue = hrefRegex.exec(htmlContent.content)) !== null) {
			const manifestData = manifestArray.find(
				(f) =>
					f?.href?.split("/")[f?.href?.split("/").length - 1] ===
					hrefValue[1]?.split("/")[hrefValue[1]?.split("/").length - 1],
			);
			const replacer = manifestData ? manifestData?.href : hrefValue[1];
			htmlContent.content = htmlContent.content.replace(
				new RegExp(hrefValue[1], "g"),
				replacer,
			);
		}

		// const bookFile = await File.findById(bookData.file);
		// const bookLength = bookFile?.assets?.reduce(
		// 	(p, c) => p + (c?.length || 0),
		// 	0,
		// );

		// let chapter: { path: string; length: number } = bookFile.assets.find(
		// 	(f: { path: string; length: number }) =>
		// 		f?.path.split("/")[f?.path.split("/").length - 1] ===
		// 		chapterData.href.split("/")[chapterData.href.split("/").length - 1],
		// );

		// if (!chapter) {
		// 	chapter = {
		// 		path: chapterData.href,
		// 		length: htmlContent.content
		// 			.replace(/<[^>]*>/g, " ")
		// 			.trim()
		// 			.split(/\s+/).length,
		// 	};
		// 	await File.findByIdAndUpdate(
		// 		bookFile._id,
		// 		{
		// 			assets: bookFile.assets.concat([chapter]),
		// 		},
		// 		{ new: true },
		// 	);
		// }

		// if (bookRead) {
		// 	const chapterAtBookRead = bookRead.content.find(
		// 		(e) => e?.path === chapterData?.href,
		// 	);
		// 	if (!chapterAtBookRead) {
		// 		const content = bookRead.content.concat([chapter]);
		// 		const progerss =
		// 			content?.length === 0
		// 				? 0
		// 				: content?.reduce((p, c) => p + (c?.length || 0), 0);
		// 		await BookRead.findByIdAndUpdate(bookRead._id, {
		// 			content: content,
		// 			readingProgress: (progerss / bookLength) * 100,
		// 		});
		// 	}
		// } else {
		// 	const content = bookRead?.content.concat([chapter]);
		// 	const progerss =
		// 		content?.length === 0
		// 			? 0
		// 			: content?.reduce((p, c) => p + (c?.length || 0), 0);
		// 	await BookRead.create({
		// 		user: user._id,
		// 		book: bookData._id,
		// 		content: content,
		// 		readingProgress: (progerss / bookLength) * 100,
		// 		status: bookData.price === 0 ? "purchased" : "sample",
		// 	});
		// }
		// console.log(htmlContent.content);
		// console.log(htmlContent.parsedData);
		// console.log(typeof htmlContent.content);

		return res.json({
			content: htmlContent.content,
			parsedData: htmlContent.parsedData,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};

export default readChapter;
