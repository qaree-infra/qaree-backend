import { auth } from "../../../../../middleware/general/auth.js";
import User from "../../../../../models/user.js";

const userInfo = async (_, args, context) => {
	try {
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const user = await User.findById(auth.user._id).populate('avatar');

		return user;
	} catch (error) {
		throw new Error(error);
	}
};

export default userInfo;
