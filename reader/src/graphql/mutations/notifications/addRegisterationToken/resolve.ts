import { auth } from "../../../../middleware/general/auth.js";
import User from "../../../../models/user.js";

export default async function resolve(_, args: { token: string }, context) {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;
		if (auth.error) throw new Error(auth.error);

		const updated = await User.findByIdAndUpdate(
			auth.user._id,
			{ notifications: { token: args.token } },
			{ new: true },
		);

		if (updated) {
			return { success: true, message: "Token added successfully" };
		}
	} catch (err) {
		throw new Error(err);
	}
}
