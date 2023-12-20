import User from "../../../models/user.js";
import { auth } from "../../../middleware/auth.js";

const deleteAccount = async (_, args, context) => {
	const { lang } = context.query;
	try {
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const userId = auth.user._id.toString();
		const user = await User.findByIdAndDelete(userId);

		return {
			message:
				lang === "ar" ? "تم حذف الحساب بنجاح" : "Deleted account successfully",
			deleted_id: user?._id.toString() || userId,
			success: true,
		};
	} catch (error) {
		throw new Error(error);
	}
};

export default deleteAccount;
