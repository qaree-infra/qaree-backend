import authMiddleware, { AuthInterface } from "../../middleware/auth.js";
import { createAcessToken } from "../../../utils/helper.js";

const getRefreshToken = async (_, args, context) => {
	try {
		const { lang } = context.query;
		const auth: AuthInterface = await authMiddleware(context);

		if (auth?.error) {
			throw new Error(auth?.error);
		} else {
			const user = auth.user;
			const refresh_token = createAcessToken({
				email: user.email,
				id: user._id,
			});

			return {
				refresh_token,
				message:
					lang === "ar"
						? "تم تسجيل الدخول بنجاح"
						: "You are logged in successfully",
			};
		}
	} catch (error) {
		throw new Error(error);
	}
};

export default getRefreshToken;
