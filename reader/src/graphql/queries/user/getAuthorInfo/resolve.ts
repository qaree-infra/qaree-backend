import User from "../../../../models/user.js";
import { auth } from "../../../../middleware/general/auth.js";
import mongoose from "mongoose";

export default async function getAutherInfo(_, args, context) {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;

		const { userId } = args;

		if (!userId)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل معرف المستخدم"
					: "please, enter a user ID",
			);

		if (!mongoose.isObjectIdOrHexString(userId))
			throw new Error(
				lang === "ar" ? "معرف المستخدم غير صالح" : "Invalid user id",
			);

		const user = await User.findById(userId).populate("avatar");

		if (!user) {
			throw new Error(
				lang === "ar" ? "هذا المستخدم غير موجود" : "User not found",
			);
		}

		return Object.assign(user, {
			isFollowed:
				user.followers.length > 0 && user.followers.includes(auth.user._id),
		});
	} catch (error) {
		console.log(error);
		throw new Error(error.message);
	}
}
