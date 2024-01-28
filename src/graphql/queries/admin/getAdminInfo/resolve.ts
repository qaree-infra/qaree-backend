import { adminAuth } from "../../../../middleware/adminAuth.js";
import Admin from "../../../../models/admin.js";

const adminInfo = async (_, args, context) => {
	try {
		const adminAuth: adminAuth = context.adminAuth;

		if (adminAuth?.error) throw new Error(adminAuth?.error);

		const user = await Admin.findById(adminAuth.admin._id).populate("avatar");

		return user;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default adminInfo;
