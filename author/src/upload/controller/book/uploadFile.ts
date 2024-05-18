import fs from "fs";
import unzipper from "unzipper";
import { EPub } from "epub2";
import { Response, Request } from "express";
import cloudinarySdk, { UploadApiOptions } from "cloudinary";
import Book, { BookInterface } from "../../../models/book.js";
import File, { FileInterface } from "../../../models/file.js";
import { UserInterface } from "../../../models/user.js";
import { getBookFiles } from "../../../utils/readFile.js";

const cloudinary = cloudinarySdk.v2;

const {
	CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_CLOUD_API_KEY,
	CLOUDINARY_CLOUD_API_SECRET,
} = process.env;

cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_CLOUD_API_KEY,
	api_secret: CLOUDINARY_CLOUD_API_SECRET,
});

type auth = {
	error?: string;
	user?: UserInterface;
};

interface UploadRequest extends Request {
	auth: auth;
}

const replaceAllLinks = (
	content: Buffer | string,
	epub: EPub,
	bookId: string,
	epubURL: string,
) => {
	// const text = Buffer.from(content).toString("utf-8");

	content = Buffer.from(content).toString("utf-8");

	const srcRegex = /src="([^"]*)"/g;
	const hrefRegex = /href="([^"]*)"/g;
	let srcValue;
	while ((srcValue = srcRegex.exec(content as string)) !== null) {
		const manifestData: {
			href?: string;
			mediaType?: string;
			"media-type"?: string;
		} = Object.values(epub.manifest).find(
			(f: { href?: string; mediaType?: string; "media-type"?: string }) =>
				f?.href?.split("/")[f?.href?.split("/").length - 1] ===
				srcValue[1]
					?.split("/")
					[srcValue[1]?.split("/").length - 1].split("#")[0],
		);

		const replacer = manifestData
			? epubURL.split("/").slice(0, 10).join("/") + "/" + manifestData.href
			: srcValue[1];
		// console.log(srcValue[1]);
		// console.log(replacer);
		content = content.replace(new RegExp(srcValue[1], "g"), replacer);
	}

	let hrefValue;
	while ((hrefValue = hrefRegex.exec(content as string)) !== null) {
		const manifestData: {
			href?: string;
			mediaType?: string;
			"media-type"?: string;
		} = Object.values(epub.manifest).find(
			(f: { href?: string; mediaType?: string; "media-type"?: string }) =>
				f?.href?.split("/")[f?.href?.split("/").length - 1] ===
				hrefValue[1]
					?.split("/")
					[hrefValue[1]?.split("/").length - 1].split("#")[0],
		);
		// const replacer = manifestData
		// 	? manifestData?.href + hrefValue[1].split("#")[1]
		// 	: hrefValue[1];
		const replacer = manifestData
			? epubURL.split("/").slice(0, 10).join("/") + "/" + manifestData.href
			: hrefValue[1];
		// console.log(hrefValue[1]);
		// console.log(replacer);
		content = (content as string).replace(
			new RegExp(hrefValue[1], "g"),
			replacer,
		);
	}

	// console.log(content);
	return Buffer.from(content as string, "utf-8");
};

const unextractAndUpload = (
	file,
	folder,
	epub,
	newFileData,
	bookId,
	epubURL,
) => {
	return new Promise(async (res, rej) => {
		const unzipFile = fs.createReadStream(file.path);
		const assets = [];
		const uploadPromises = [];

		let uploadedCount = 0,
			allUploaded,
			totalFiles = [];
		await unzipFile
			.pipe(unzipper.Parse())
			.on("entry", async (entry) => {
				const fileName = entry.path;
				const entryType = entry.type;

				if (entryType === "File") {
					await entry.buffer().then(async (content) => {
						const uploadPromise = new Promise(async (resolve, reject) => {
							const uploadStream = await cloudinary.uploader
								.upload_stream(
									{
										resource_type: fileName.endsWith(
											".apng" ||
												".avif" ||
												".bmp" ||
												".gif" ||
												".ico" ||
												".jpeg" ||
												".jpg" ||
												".png" ||
												".svg" ||
												".tif" ||
												".tiff" ||
												".webp",
										)
											? "image"
											: "raw",
										public_id: fileName,
										folder,
									},
									async (err, result) => {
										if (err) reject(err);

										const file: {
											href?: string;
											mediaType?: string;
											"media-type"?: string;
										} = Object.values(epub.manifest).find(
											(e: {
												href: string;
												mediaType?: string;
												"media-type"?: string;
											}) => e?.href?.includes(fileName),
										);
										totalFiles.push(file);
										if (
											file?.mediaType === "application/xhtml+xml" ||
											file?.["media-type"] === "application/xhtml+xml"
										) {
											const text = Buffer.from(content)
												.toString("utf-8")
												.replace(/<[^>]*>/g, " ");
											await assets.push({
												path: result?.secure_url
													? result?.secure_url
													: fileName,
												length: text.trim().split(/\s+/).length,
											});
										}

										resolve(assets);
									},
								)
								.on("finish", () => {
									uploadedCount++;
									if (uploadedCount === totalFiles.length) {
										// Check if all files uploaded
										allUploaded = true;
									}
									// console.log("assets: ", assets);
								})
								.end(replaceAllLinks(content, epub, bookId, epubURL)); // Upload the extracted file content

							entry.pipe(uploadStream); // Stream content directly
						});

						uploadPromises.push(uploadPromise);
					});
				} else {
					entry.autodrain();
				}
			})
			.on("finish", async () => {
				console.log("Unzip and upload completed");
				console.log(assets.length);
				console.log(uploadPromises.length);
				try {
					await Promise.all(uploadPromises);

					await File.findByIdAndUpdate(
						newFileData._id,
						{ assets },
						{ new: true },
					);

					// await console.log(totalFiles);
					// await console.log(allUploaded);

					await console.log("All uploads completed");

					await res(true);
					// ... (existing code for updating File and sending response)
				} catch (error) {
					console.error("Error uploading files:", error);
					rej("Error uploading files");
				}
			})
			.on("end", () => {
				console.log("end!!!!!!!!!!!!!!!!");
			});
	});
};

const uploadFileController = async (req: UploadRequest, res: Response) => {
	const { id } = req.params;
	let uploadedNew = false;
	try {
		const file = req.file;
		const user = req.auth.user;
		const folder = `book/file/${id}`;
		const options: UploadApiOptions = {
			folder: folder,
			format: "epub",
			resource_type: "raw",
		};

		const epub = await EPub.createAsync(file.path, "", "");
		// console.log("start manifest");
		// console.log(epub.manifest);
		// console.log("end manifest");

		const book: BookInterface = await Book.findById(id);

		const fileData: FileInterface = await File.findOne({
			userId: user._id,
			_id: book["file"],
		});

		if (book["file"]) {
			await cloudinary.api.delete_resources_by_prefix(`book/file/${book._id}`, {
				resource_type: "raw",
			});

			await File.findByIdAndDelete(fileData?._id);
		}

		const result = await cloudinary.uploader.upload(file.path, options);

		if (result) uploadedNew = true;

		const newFileData: FileInterface = await File.create({
			name: result.public_id,
			type: result.format,
			size: result.bytes,
			path: result.secure_url,
			userId: user._id.toString(),
		});

		await Book.findByIdAndUpdate(
			book._id,
			{ file: newFileData._id },
			{ new: true },
		);

		const uploadFilesResult = await unextractAndUpload(
			file,
			folder,
			epub,
			newFileData,
			id,
			result.secure_url,
		);

		if (uploadFilesResult) {
			return res.status(200).json(newFileData);
		} else {
			return res.status(400).json({ message: "Invaid file while extract it" });
		}
	} catch (error) {
		console.log("last: ", error);
		const allFiles = await getBookFiles({ _id: id } as BookInterface);

		if (allFiles && uploadedNew)
			await cloudinary.api.delete_resources_by_prefix(`book/file/${id}`, {
				resource_type: "raw",
			});
		return res.status(500).json({ message: error?.message || error });
	}
};

export default uploadFileController;
