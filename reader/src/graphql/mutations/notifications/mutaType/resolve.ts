import { auth } from "../../../../middleware/general/auth.js";
import User from "../../../../models/user.js";

const types = ["new book", "messageing", "reviewing book", "following"];

export default async function resolve(_, args, context) {
	try {
		const { type } = args;
		const { lang } = context.query;

		const auth: auth = context.auth;
		if (auth.error) throw new Error(auth.error);

		if (!type)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل نوع الاشعارات"
					: "please enter the notification type",
			);

		if (!types.includes(type)) {
			throw new Error(
				lang === "ar" ? "النوع غير موجود" : "the type is not available",
			);
		}

		const newType = type
			.split(" ")
			.map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1)))
			.join("");

		await User.findByIdAndUpdate(
			auth.user._id,
			{
				notifications: {
					...auth.user.notifications,
					[newType]: false,
				},
			},
			{ new: true },
		);

		return {
			success: true,
			message:
				lang === "ar"
					? "تم كتم هذا النوع من الاشعارات"
					: "These notifications have been muted.",
		};
	} catch (err) {
		console.error(err);
		throw new Error(err.message);
	}
}
