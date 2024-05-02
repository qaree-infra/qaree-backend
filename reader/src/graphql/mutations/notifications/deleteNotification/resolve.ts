import { auth } from "../../../../middleware/general/auth.js";
import Notification from "../../../../models/notification.js";
import mongoose from "mongoose";

export default async function resolve(_, args, context) {
	try {
		const { lang } = context.query;
		const auth: auth = context.auth;

		if (auth.error) throw new Error(auth.error);

		const { notificationId } = args;

		if (!notificationId)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل معرف الاشعار"
					: "Please enter a notification id",
			);

		if (!mongoose.isObjectIdOrHexString(notificationId))
			throw new Error(
				lang === "ar" ? "معرف الاشعار غير صالح" : "invalid notification id",
			);

		await Notification.findByIdAndDelete(notificationId);

		return {
			success: true,
			message:
				lang === "ar"
					? "تم حذف الاشعار"
					: "The notification have been deleted successfully.",
		};
	} catch (error) {
		console.error(error);
		throw new Error(error.message);
	}
}
