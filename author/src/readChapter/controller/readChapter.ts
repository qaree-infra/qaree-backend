import { AuthRequest } from "../../middleware/general/auth.js";
import { BookInterface } from "../../models/book.js";
import readFile, {
	getBookFiles,
	getEPubRootFile,
	parseManifest,
} from "../../utils/readFile.js";

interface RequestWithBookData extends AuthRequest {
	bookData: BookInterface;
}

const readChapterForAuthor = async (req: RequestWithBookData, res) => {
	try {
		const { lang } = req.query;
		const { chId } = req.params;

		const bookData = req.bookData;
		const allAssets = await getBookFiles(bookData);

		const bookContainerURL = allAssets.find((asset: string) =>
			asset.toLowerCase().includes("meta-inf/container.xml"),
		);

		const { filename } = await getEPubRootFile(bookContainerURL);

		const contentFileURL = allAssets.find((asset) =>
			asset.toLowerCase().includes(filename),
		);

		const { parsedData } = await readFile(contentFileURL);

		const manifest = parseManifest(
			allAssets,
			bookContainerURL,
			parsedData.manifest,
		);

		const fileData = manifest[chId];
		const extention = "application/xhtml+xml";

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

		const htmlContent = await readFile(fileData.href);

		const manifestArray: Array<{ id: string; href: string }> =
			Object.values(manifest);

		// todo: replace all hrefs with real hrefs from manifest
		const srcRegex = /src="([^"]*)"/g;
		const hrefRegex = /href="([^"]*)"/g;
		let srcValue;
		while ((srcValue = srcRegex.exec(htmlContent.content)) !== null) {
			const manifestData = manifestArray.find((f) =>
				f?.href?.endsWith(srcValue[1]),
			);
			htmlContent.content = htmlContent.content.replaceAll(
				srcValue[1],
				manifestData?.href || srcValue[1],
			);
		}

		let hrefValue;
		while ((hrefValue = hrefRegex.exec(htmlContent.content)) !== null) {
			const manifestData = manifestArray.find((f) =>
				f?.href?.endsWith(hrefValue[1]),
			);
			htmlContent.content = htmlContent.content.replaceAll(
				hrefValue[1],
				manifestData?.href || hrefValue[1],
			);
		}

		res.send(htmlContent.content);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export default readChapterForAuthor;
