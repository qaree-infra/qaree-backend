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

export default resolve;
