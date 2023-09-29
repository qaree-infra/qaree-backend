import authMiddleware, { AuthInterface } from "../../middleware/auth.js";

const userInfo = async (_, args, context) => {
	try {
		const auth: AuthInterface = await authMiddleware(context);

		if (auth?.error) {
			throw new Error(auth?.error);
		} else {
			const user = auth.user;

			return user;
		}
	} catch (error) {
		throw new Error(error);
	}
};

export default userInfo;
