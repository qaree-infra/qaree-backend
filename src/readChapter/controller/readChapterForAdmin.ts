import { AuthRequest } from "../../middleware/general/adminAuth.js";
import { BookInterface } from "../../models/book.js";
import readFile, {
	getBookFiles,
	getEPubRootFile,
	parseManifest,
} from "../../utils/readFile.js";

interface RequestWithBookData extends AuthRequest {
	bookData: BookInterface;
}

const readChapterForAdmin = async (req: RequestWithBookData, res) => {
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

		const manifest = parseManifest(bookContainerURL, parsedData.manifest);

		const fileData = manifest[chId];

		if (!fileData)
			res.status(404).json({
				message:
					lang === "ar"
						? "عفواً هذا الفصل غير موجود"
						: "Sorry, this chapter didn't found",
			});
		const htmlContent = await readFile(fileData.href);

		res.send(htmlContent.content);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export default readChapterForAdmin;
