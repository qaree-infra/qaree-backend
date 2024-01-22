import mongoose from "mongoose";
import { Response, Request } from "express";
import cloudinarySdk, { UploadApiOptions } from "cloudinary";
import Book, { BookInterface } from "../models/book.js";
import File, { FileInterface } from "../models/file.js";
import User, { UserInterface } from "../models/user.js";
import Category, { CategoryInterface } from "../models/category.js";
import { AdminInterface } from "../models/admin.js";

const cloudinary = cloudinarySdk.v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
	api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

const uploadBookRelatedFile = async (
	file,
	fileType: string,
	options: UploadApiOptions,
	user: UserInterface,
	book: BookInterface,
) => {
	if (!fileType.includes("cover")) {
		options.format = "epub";
		options.resource_type = "raw";
	}

	const fileData: FileInterface = await File.findOne({
		userId: user._id,
		path: book[fileType],
	});

	if (book[fileType]) {
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

	const updatedBook = await Book.findByIdAndUpdate(
		book._id,
		{ [fileType]: newFileData._id },
		{ new: true },
	);

	return newFileData;
};

type auth = {
	error?: string;
	user?: UserInterface;
};

type adminAuth = {
	error?: string;
	admin?: AdminInterface;
};

interface UploadRequest extends Request {
	auth: auth;
	adminAuth: adminAuth;
}

const uploadController = async (req: UploadRequest, res: Response) => {
	try {
		const { id } = req.params;
		const file = req.file;
		const folder = req.url.split("/")[2];
		const fileRef = req.url.split("/")[1];
		const user = req.auth.user;
		const options: UploadApiOptions = {
			folder: `${fileRef}/${folder}`,
		};

		if (fileRef === "book") {
			const book: BookInterface = await Book.findById(id);

			if (folder === "cover") {
				options.crop = "fill";

				const newCover = await uploadBookRelatedFile(
					file,
					"cover",
					options,
					user,
					book,
				);

				return res.status(200).json(newCover);
			} else if (folder === "file") {
				const newBookFile = await uploadBookRelatedFile(
					file,
					"file",
					options,
					user,
					book,
				);

				return res.status(200).json(newBookFile);
			} else {
				const newBookFile = await uploadBookRelatedFile(
					file,
					"sample",
					options,
					user,
					book,
				);

				return res.status(200).json(newBookFile);
			}
		} else if (fileRef === "user") {
			options.width = 200;
			options.height = 200;
			options.crop = "fill";

			const oldAvatar = await File.findOne({ path: user?.avatar });
			if (user.avatar) {
				await File.findByIdAndDelete(oldAvatar?._id);
				cloudinary.api.delete_resources([oldAvatar?.name]);
			}

			const result = await cloudinary.uploader.upload(file.path, options);

			const savedAvatar = await File.create({
				name: result.public_id,
				type: result.format,
				size: result.bytes,
				path: result.secure_url,
				userId: user._id.toString(),
			});

			await User.findByIdAndUpdate(
				user._id,
				{ avatar: savedAvatar._id },
				{ new: true },
			);

			return res.status(200).json(savedAvatar);
		} else if (fileRef === "category") {
			const admin = req.adminAuth.admin;
			const { id } = req.params;
			const { lang } = req.query;

			options.width = 150;
			options.height = 150;
			options.crop = "fill";

			if (!id)
				return res.status(400).json({
					message:
						lang === "ar"
							? "من فضلك ادخل معرف التصنيف"
							: "please, enter the category id",
				});

			if (!mongoose.isObjectIdOrHexString(id))
				return res.status(400).json({
					message:
						lang === "ar" ? "معرف التصنيف غير صالح" : "Invalid category id",
				});

			const category: CategoryInterface = await Category.findById(id);

			if (!category)
				return res.status(400).json({
					message:
						lang === "ar"
							? "هذا التصنيف غير موجود"
							: "This category is nonfound",
				});

			const oldIcon = await File.findById(category.icon);

			if (category.icon) cloudinary.api.delete_resources([oldIcon?.name]);

			const result = await cloudinary.uploader.upload(file.path, options);

			const savedFile = await File.create({
				name: result.public_id,
				type: result.format,
				size: result.bytes,
				path: result.secure_url,
				userId: admin._id.toString(),
			});

			await Category.findByIdAndUpdate(
				category._id,
				{ icon: savedFile._id },
				{ new: true },
			);

			return res.status(200).json(savedFile);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};

export default uploadController;
