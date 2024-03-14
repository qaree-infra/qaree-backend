import { Response, Request } from "express";
import cloudinarySdk, { UploadApiOptions } from "cloudinary";
import File, { FileInterface } from "../../../models/file.js";
import User, { UserInterface } from "../../../models/user.js";

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

const uploadAvatarController = async (req: UploadRequest, res: Response) => {
	try {
		const file = req.file;
		const user = req.auth.user;
		const options: UploadApiOptions = {
			folder: `user/avatar`,
			width: 200,
			height: 200,
			crop: "fill",
		};

		const oldAvatar = await File.findById(user.avatar);
		if (user.avatar) {
			await File.findByIdAndDelete(user.avatar);
			cloudinary.api.delete_resources([oldAvatar?.name]);
		}

		const result = await cloudinary.uploader.upload(file.path, options);

		const savedAvatar: FileInterface = await File.create({
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
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};

export default uploadAvatarController;
