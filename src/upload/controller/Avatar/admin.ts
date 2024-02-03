import mongoose from "mongoose";
import { Response, Request } from "express";
import cloudinarySdk, { UploadApiOptions } from "cloudinary";
import File, { FileInterface } from "../../../models/file.js";
import Admin, { AdminInterface } from "../../../models/admin.js";

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
		const admin = req.adminAuth.admin;
		const file = req.file;
		const folder = req.url.split("/")[2];
		const fileRef = req.url.split("/")[1];
		const options: UploadApiOptions = {
			folder: `admin/avatar`,
			width: 200,
			height: 200,
			crop: "fill",
		};

		const oldAvatar = await File.findById(admin?.avatar);
		if (admin.avatar) {
			await File.findByIdAndDelete(oldAvatar?._id);
			cloudinary.api.delete_resources([oldAvatar?.name]);
		}

		const result = await cloudinary.uploader.upload(file.path, options);

		const savedAvatar: FileInterface = await File.create({
			name: result.public_id,
			type: result.format,
			size: result.bytes,
			path: result.secure_url,
			userId: admin._id.toString(),
		});

		await Admin.findByIdAndUpdate(
			admin._id,
			{ avatar: savedAvatar._id },
			{ new: true },
		);

		return res.status(200).json(savedAvatar);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};

export default uploadController;
