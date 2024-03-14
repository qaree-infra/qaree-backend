import { auth } from "../../../../middleware/general/auth.js";
import Admin, { AdminInterface } from "../../../../models/admin.js";

const adminInfo = async (_, args, context) => {
	try {
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const user: AdminInterface = await Admin.findById(auth.admin._id).populate("avatar");

		return user;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default adminInfo;
