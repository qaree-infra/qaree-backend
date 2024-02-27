import { auth } from "../../../../middleware/general/auth.js";
import Admin from "../../../../models/admin.js";

const deleteAccountResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const adminId = auth.admin._id;

		const admin = await Admin.findByIdAndDelete(adminId);

		return {
			message:
				lang === "ar" ? "تم حذف الحساب بنجاح" : "Deleted account successfully",
			deleted_id: admin?._id || adminId,
			success: true,
		};
	} catch (error) {
		throw new Error(error);
	}
};

export default deleteAccountResolve;
