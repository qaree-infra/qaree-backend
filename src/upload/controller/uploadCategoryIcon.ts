import mongoose from "mongoose";
import { Response, Request } from "express";
import cloudinarySdk, { UploadApiOptions } from "cloudinary";
import File, { FileInterface } from "../../models/file.js";
import Category, { CategoryInterface } from "../../models/category.js";
import { AdminInterface } from "../../models/admin.js";

const cloudinary = cloudinarySdk.v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
	api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

type adminAuth = {
	error?: string;
	admin?: AdminInterface;
};

interface UploadRequest extends Request {
	adminAuth: adminAuth;
}

const uploadController = async (req: UploadRequest, res: Response) => {
	try {
		const { id } = req.params;
		const file = req.file;
		const folder = req.url.split("/")[2];
		const fileRef = req.url.split("/")[1];
		const admin = req.adminAuth.admin;
		const options: UploadApiOptions = {
			folder: `${fileRef}/${folder}`,
		};

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
					lang === "ar" ? "هذا التصنيف غير موجود" : "This category is nonfound",
			});

		const oldIcon: FileInterface = await File.findById(category.icon);

		if (category.icon) cloudinary.api.delete_resources([oldIcon?.name]);

		const result = await cloudinary.uploader.upload(file.path, options);

		const savedFile: FileInterface = await File.create({
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
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export default uploadController;
