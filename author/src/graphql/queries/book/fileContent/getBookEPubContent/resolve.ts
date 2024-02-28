import { auth } from "../../../../../middleware/general/auth.js";
import verifyBook from "../../../../../middleware/general/verifyBook.js";
import readFile, {
	getBookFiles,
	parseSpain,
	parseManifest,
	getEPubRootFile,
	parseTOC,
} from "../../../../../utils/readFile.js";

const resolve = async (_, args, context) => {
	try {
		const { lang } = context.query;
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { bookId } = args;

		const { error, bookData } = await verifyBook(
			context,
			bookId,
			auth.user._id,
		);

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

		const extention = "application/xhtml+xml";

		return {
			content: realTOC,
			allHTML: Object.values(manifest).filter(
				(f) =>
					f?.["media-type"] === extention || f?.["mediaType"] === extention,
			),
		};
	} catch (error) {
		throw new Error(error);
	}
};

export default resolve;
