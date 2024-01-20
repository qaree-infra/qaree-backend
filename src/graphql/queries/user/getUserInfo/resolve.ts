import { auth } from "../../../../middleware/auth.js";

const userInfo = async (_, args, context) => {
	try {
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const user = auth.user;

		return user;
	} catch (error) {
		throw new Error(error);
	}
};

export default userInfo;
