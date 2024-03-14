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

const uploadCoverController = async (req: UploadRequest, res: Response) => {
	try {
		const { id } = req.params;
		const file = req.file;
		const user = req.auth.user;
		const options: UploadApiOptions = {
			folder: `book/cover`,
			crop: "fill",
		};

		const book: BookInterface = await Book.findById(id);

		const fileData: FileInterface = await File.findOne({
			userId: user._id,
			_id: book["cover"],
		});

		if (book["cover"]) {
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
			{ cover: newFileData._id },
			{ new: true },
		);

		return res.status(200).json(newFileData);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};

export default uploadCoverController;
