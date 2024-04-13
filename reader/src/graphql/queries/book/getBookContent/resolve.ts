import verifyBook from "../../../middleware/verifyBook.js";
import { BookInterface } from "../../../../models/book.js";
import readFile, {
	getBookFiles,
	getEPubRootFile,
	parseManifest,
	parseSpain,
	parseTOC,
} from "../../../../utils/readFile.js";

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

		if (!bookData?.file) throw new Error("Book file didn't found");

		const allAssets = await getBookFiles(bookData);
		if (!allAssets?.length) throw new Error("Extarcted files didn't found");

		const bookContainerURL = allAssets.find((asset) =>
			asset.toLowerCase().includes("meta-inf/container.xml"),
		);

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
		console.log(error);
		throw new Error(error.message);
	}
};

export default getBookContent;
