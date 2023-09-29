import authMiddleware, { AuthInterface } from "../../middleware/auth.js";
import { createAcessToken } from "../../../utils/helper.js";
import { UserInterface } from "../../../models/user.js";

const getRefreshToken = async (_, args, context) => {
	try {
		const auth: AuthInterface = await authMiddleware(context);

		if (auth?.error) {
			throw new Error(auth?.error);
		} else {
			const user = auth.user;
			const refresh_token = createAcessToken({
				email: user.email,
				id: user._id,
			});

			return { refresh_token, message: "You are logged in successfully" };
		}
	} catch (error) {
		throw new Error(error);
	}
};

export default getRefreshToken;
