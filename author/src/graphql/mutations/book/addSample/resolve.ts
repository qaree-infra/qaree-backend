import { auth } from "../../../../middleware/general/auth.js";
import verifyBook from "../../../../middleware/general/verifyBook.js";
import Book from "../../../../models/book.js";

import readFile, {
	getBookFiles,
	getEPubRootFile,
	parseManifest,
} from "../../../../utils/readFile.js";

const resolve = async (_, args, context) => {
	try {
		const { lang } = context.query;
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { bookId, sample } = args;

		const bookVerification = await verifyBook(context, bookId, auth.user._id);
		if (bookVerification?.error) throw new Error(bookVerification?.error);

		const allAssets = await getBookFiles(bookVerification.bookData);

		const bookContainerURL = allAssets.find((asset: string) =>
			asset.toLowerCase().includes("meta-inf/container.xml"),
		);

		const { filename } = await getEPubRootFile(bookContainerURL);

		const contentFile = allAssets.find((asset) =>
			asset.toLowerCase().includes(filename),
		);

		const { parsedData } = await readFile(contentFile);

		const manifest = parseManifest(
			allAssets,
			bookContainerURL,
			parsedData.manifest,
		);

		const extention = "application/xhtml+xml";

		const allHTML = Object.values(manifest).filter(
			(f) => f?.["media-type"] === extention || f?.["mediaType"] === extention,
		);

		const allAtHTMLFiles = sample.every((e) => {
			return (
				allHTML.find((html: { id: string }) => {
					return html.id === e;
				}) !== undefined
			);
		});

		if (!allAtHTMLFiles)
			throw new Error(
				lang === "ar" ? "هذه القائمة غير صالحة" : "invalid sample",
			);

		await Book.findByIdAndUpdate(bookVerification.bookData._id, {
			sample: sample,
		});

		return {
			message: "Sample added successfully",
			book: { ...bookVerification.bookData, sample },
		};
	} catch (error) {
		throw new Error(error.message);
	}
};

export default resolve;
