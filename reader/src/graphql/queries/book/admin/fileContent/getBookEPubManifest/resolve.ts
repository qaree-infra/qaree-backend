import { adminAuth } from "../../../../../../middleware/general/adminAuth.js";
import adminVerifyBook from "../../../../../../middleware/general/adminVerifyBook.js";
import readFile, {
	parseManifest,
	getEPubRootFile,
	getBookFiles,
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

		const bookContentFileData = await readFile(contentFile, true);
		const manifest = parseManifest(
			bookContainerURL,
			bookContentFileData.parsedData.manifest,
		);

		const result = Object.values(manifest).map((file) => {
			file["mediaType"] = file["media-type"];
			delete file["media-type"];

			return file;
		});

		return { files: result, total: result.length };
	} catch (error) {
		throw new Error(error);
	}
};

export default resolve;
