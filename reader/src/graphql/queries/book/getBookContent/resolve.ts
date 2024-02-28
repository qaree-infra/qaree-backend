import cloudinarySdk from "cloudinary";
import verifyBook from "../../../middleware/verifyBook.js";
import { BookInterface } from "../../../../models/book.js";
import File, { FileInterface } from "../../../../models/file.js";
import readFile, {
	getBookFiles,
	getEPubRootFile,
	parseManifest,
	parseSpain,
	parseTOC,
} from "../../../../utils/readFile.js";

const cloudinary = cloudinarySdk.v2;

interface VerifyBookInterface {
	error?: string;
	bookData: BookInterface;
}

const getBookContent = async (_, args, context) => {
	try {
		const { bookId } = args;
		const { error, bookData }: VerifyBookInterface = await verifyBook(
			bookId,
			context,
		);

		if (error) {
			throw new Error(error);
		}

		const allAssets = await getBookFiles(bookData);

		const bookContainerURL = allAssets.find((asset) =>
			asset.toLowerCase().includes("meta-inf/container.xml"),
		);

		const { filename } = await getEPubRootFile(bookContainerURL);

		const contentFile = allAssets.find((asset) =>
			asset.toLowerCase().includes(filename),
		);

		const { parsedData } = await readFile(contentFile);

		const manifest = parseManifest(bookContainerURL, parsedData.manifest);

		const { contents, toc } = await parseSpain(
			parsedData.spine,
			bookContainerURL,
			manifest,
		);

		const realTOC = await parseTOC({ toc, contents }, manifest);

		const extention = "application/xhtml+xml";

		return {
			content: realTOC,
			allHTML: Object.values(manifest).filter(
				(f) =>
					f?.["media-type"] === extention || f?.["mediaType"] === extention,
			),
		};
	} catch (error) {
		throw new Error(error.message);
	}
};

export default getBookContent;
