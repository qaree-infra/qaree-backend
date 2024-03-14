import { google } from "googleapis";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import User from "../../../../models/user.js";
import { createAcessToken } from "../../../../utils/helper.js";

dotenv.config();

const { MAILING_SERVICE_CLIENT_ID, GOOGLE_SECRET } = process.env;

const { OAuth2 } = google.auth;
const client = new OAuth2(MAILING_SERVICE_CLIENT_ID);

const googleLogin = async (_, { google_token }, context) => {
	const { lang } = context.query;
	try {
		const verify = await client.verifyIdToken({
			idToken: google_token,
			audience: MAILING_SERVICE_CLIENT_ID,
		});

		const { email_verified, email, name, picture } = verify.getPayload();

		if (!email_verified)
			throw new Error(
				lang === "ar"
					? "لم يتم التحقق من هذا البريد الإلكتروني، تحقق منه وحاول مرة أخرى لاحقًا."
					: "This email is not verify, verify it and try again later.",
			);

		const oldUser = await User.findOne({ email });

		if (oldUser) {
			const access_token = createAcessToken({
				email: oldUser.email,
				id: oldUser._id,
			});

			return { message: "Successful Login.", access_token };
		} else {
			const password = email + GOOGLE_SECRET;
			const hashedPassword = await bcrypt.hash(password, 12);

			const newUser = await User.create({
				name,
				email,
				password: hashedPassword,
				avatar: picture,
			});

			const token = createAcessToken({
				email: newUser.email,
				id: newUser._id,
			});

			return {
				message: lang === "ar" ? "تسجيل دخول ناجح" : "Successful Login",
				access_token: token,
			};
		}
	} catch (error) {
		throw new Error(error);
	}
};

export default googleLogin;
