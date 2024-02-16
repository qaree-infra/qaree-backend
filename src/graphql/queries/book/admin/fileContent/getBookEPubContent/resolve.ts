import { adminAuth } from "../../../../../../middleware/general/adminAuth.js";
import adminVerifyBook from "../../../../../../middleware/general/adminVerifyBook.js";
import readFile, {
	getBookFiles,
	parseSpain,
	parseManifest,
	getEPubRootFile,
	parseTOC,
} from "../../../../../../utils/readFile.js";

const resolve = async (_, args, context) => {
	try {
		const { lang } = context.query;
		const adminAuth: adminAuth = context.adminAuth;

		if (adminAuth?.error) throw new Error(adminAuth?.error);

		const { bookId } = args;

		const { error, bookData } = await adminVerifyBook(bookId, context);

		if (error) {
			throw new Error(error);
		}

		const allAssets = await getBookFiles(bookData);

		const bookContainerURL = allAssets.find((asset: string) =>
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

		return { content: realTOC };
	} catch (error) {
		throw new Error(error);
	}
};

export default resolve;
