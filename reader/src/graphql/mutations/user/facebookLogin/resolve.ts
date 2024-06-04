import axios from "axios";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import User from "../../../../models/user.js";
import { createAcessToken } from "../../../../utils/helper.js";

dotenv.config();

const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_SECRET } = process.env;

const REDIRECT_URI = "<http://localhost:3000/auth/facebook/callback>";
export default async (_, { accessToken, regestrationToken }, context) => {
	const { lang } = context.query;
	try {
		const { data } = await axios({
			url: "https://graph.facebook.com/me",
			method: "get",
			params: {
				fields: ["id", "email", "first_name", "last_name", "avatar"].join(","),
				access_token: accessToken,
			},
		});
		const { email, avatar } = data;

		const oldUser = await User.findOne({ email });

		if (oldUser) {
			if (regestrationToken) {
				await User.findByIdAndUpdate(
					oldUser._id,
					{
						notifications: {
							...oldUser.notifications,
							token: regestrationToken,
						},
					},
					{ new: true },
				);
			}

			const access_token = createAcessToken({
				email: oldUser.email,
				id: oldUser._id,
			});

			return { message: "Successful Login.", access_token };
		} else {
			const password = email + FACEBOOK_SECRET;
			const hashedPassword = await bcrypt.hash(password, 12);

			const newUser = await User.create({
				name,
				email,
				password: hashedPassword,
				avatar: avatar,
				notifications: {
					token: regestrationToken,
				},
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
		throw new Error(error.message);
	}
};
