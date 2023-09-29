import User from "../../../models/user.js";
import authMiddleware, { AuthInterface } from "../../middleware/auth.js";

const deleteAccount = async (_, args, context) => {
	try {
		const auth: AuthInterface = await authMiddleware(context);

		if (auth?.error) {
			throw new Error(auth?.error);
		} else {
			const userId = auth.user._id.toString();
			const user = await User.findByIdAndDelete(userId);

			return {
				message: "Deleted account successfully",
				deleted_id: user?._id.toString() || userId,
				success: true,
			};
		}
	} catch (error) {
		throw new Error(error);
	}
};

export default deleteAccount;
