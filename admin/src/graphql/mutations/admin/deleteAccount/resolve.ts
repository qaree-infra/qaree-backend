import { adminAuth } from "../../../../middleware/general/adminAuth.js";
import Admin from "../../../../models/admin.js";

const deleteAccountResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const adminAuth: adminAuth = context.adminAuth;

		if (adminAuth?.error) throw new Error(adminAuth?.error);

		const adminId = adminAuth.admin._id;

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
