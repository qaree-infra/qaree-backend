import User from "../../../../models/user.js";
import { auth } from "../../../../middleware/general/auth.js";
import mongoose from "mongoose";
import { generateFollowingMessage, sendFcmMessage } from "../../../../utils/sendNotification.js";

function generateMsg(lang: string, followed: boolean): string {
	return lang === "ar"
		? `${!followed ? "تمت المتابعة بنجاج" : "تم الغاء المتابعة "}`
		: `${
				!followed
					? "You have followed successfully"
					: "You have not followed successfully"
		  }`;
}

export default async function resolve(_, args, context) {
	const { lang } = context.query;
	try {
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const user = auth.user;

		const { userId } = args;

		if (user._id === userId)
			throw new Error(
				lang === "ar"
					? "آسف، انت لا تستطيع ان تتابع نفسك"
					: "Sorry, you cann't follow yourself",
			);

		if (!mongoose.isObjectIdOrHexString(userId))
			throw new Error(lang == "ar" ? "هذا المعرف غير صالح" : "invalid user id");

		const requiredUser = await User.findById(userId);

		if (!requiredUser)
			throw new Error(
				lang === "ar" ? "هذا المستخدم غير موجود" : "User not found",
			);

		const followsers = requiredUser.followers.includes(user._id)
			? requiredUser.followers.filter((f) => f === user._id)
			: [user._id].concat(requiredUser.followers);

		const following = user.following.includes(userId)
			? user.following.filter((f) => f === userId)
			: [userId].concat(user.following);

		await User.findByIdAndUpdate(userId, {
			followers: followsers,
		});

		await User.findByIdAndUpdate(user._id, {
			following: following,
		});

		if (requiredUser.notifications.token && !requiredUser.followers.includes(user._id)) {
			const notificationMsg = generateFollowingMessage(user, lang);

			notificationMsg.message.token = requiredUser.notifications.token;
			sendFcmMessage(notificationMsg);
		}

		return {
			message: generateMsg(lang, requiredUser.followers.includes(user._id)),
			success: true,
		};
	} catch (error) {
		throw new Error(error.message);
	}
}
