import { auth } from "../../../../middleware/general/auth.js";
import Notification, {
	NotificationInterface,
} from "../../../../models/notification.js";

export default async function resolve(_, args, context) {
	try {
		const { lang } = context.query;
		const limit = args?.limit || 10;
		const page = args?.page || 1;
		const startIndex = (Number(page) - 1) * limit;

		const auth: auth = context.auth;

		if (auth.error) throw new Error(auth.error);

		const totalNotifications = await Notification.countDocuments({
			user: auth.user?._id.toString(),
		});

		const notifications: Array<NotificationInterface> = await Notification.find(
			{
				user: auth.user?._id.toString(),
			},
		)
			.limit(limit)
			.skip(startIndex);

		return {
			notifications: notifications,
			total: totalNotifications,
			currentPage: page,
			numberOfPages: Math.ceil(totalNotifications / limit),
		};
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
