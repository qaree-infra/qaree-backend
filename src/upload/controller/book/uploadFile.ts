import fs from "fs";
import path from "path";
import unzipper from "unzipper";
import { EPub } from "epub2";
import { Response, Request } from "express";
import cloudinarySdk, { UploadApiOptions } from "cloudinary";
import Book, { BookInterface } from "../../../models/book.js";
import File, { FileInterface } from "../../../models/file.js";
import { UserInterface } from "../../../models/user.js";

const cloudinary = cloudinarySdk.v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
	api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

type auth = {
	error?: string;
	user?: UserInterface;
};

interface UploadRequest extends Request {
	auth: auth;
}

const uploadFileController = async (req: UploadRequest, res: Response) => {
	try {
		const { id } = req.params;
		const file = req.file;
		const user = req.auth.user;
		const folder = `book/file/${id}`;
		const options: UploadApiOptions = {
			folder: folder,
			format: "epub",
			resource_type: "raw",
		};

		const book: BookInterface = await Book.findById(id);

		const fileData: FileInterface = await File.findOne({
			userId: user._id,
			_id: book["file"],
		});

		if (book["file"]) {
			cloudinary.api.delete_resources([fileData?.name]);

			await File.findByIdAndDelete(fileData?._id);
		}

		const result = await cloudinary.uploader.upload(file.path, options);

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

		const unzipFile = fs.createReadStream(file.path);
		const assets = [];

		await unzipFile
			.pipe(unzipper.Parse())
			.on("entry", async (entry) => {
				const fileName = entry.path;
				const entryType = entry.type;

				if (entryType === "File") {
					entry.buffer().then(async (content) => {
						await cloudinary.uploader
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
									folder: folder,
								},
								async (err, result) => {
									await assets.push(result.secure_url);
									await File.findByIdAndUpdate(
										newFileData._id,
										{
											assets: assets,
										},
										{ new: true },
									);
								},
							)
							.end(content);
					});
				} else {
					entry.autodrain();
				}
			})
			.on("finish", () => {
				console.log("Unzip and upload completed");
			});

		return res.status(200).json(newFileData);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};

export default uploadFileController;
