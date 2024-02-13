import cloudinarySdk from "cloudinary";
import { adminAuth } from "../../../../../middleware/adminAuth.js";
import adminVerifyBook from "../../../../middleware/adminVerifyBook.js";
import File, { FileInterface } from "../../../../../models/file.js";
import readFile, {
	parseManifest,
	getEPubRootFile,
} from "../../../../../utils/readFile.js";

const cloudinary = cloudinarySdk.v2;

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

		const bookFile: FileInterface = await File.findById(bookData.file);

		const allAssets = await cloudinary.api
			.resources({
				type: "upload",
				prefix: `book/file/${bookId}`,
				resource_type: "raw",
				max_results: 500,
			})
			.then((res) => res.resources.map((resource) => resource.secure_url));

		const bookContainerURL = allAssets.find((asset: string) =>
			asset.toLowerCase().includes("meta-inf/container.xml"),
		);

		const { filename } = await getEPubRootFile(bookContainerURL);

		const contentFile = allAssets.find((asset) =>
			asset.toLowerCase().includes(filename),
		);

		const bookContentFileData = await readFile(contentFile);
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
