import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User, { UserInterface } from "../../models/user.js";

export interface AuthInterface {
	error?: string;
	user?: UserInterface;
}

function convertArrayToObject(arr: string[]): object {
	const result = {};

	for (let i = 0; i < arr.length; i += 2) {
		const key = arr[i];
		const value = arr[i + 1];

		result[key] = value;
	}

	return result;
}

const auth = async (context) => {
	try {
		const { lang } = context.query;
		const headers = convertArrayToObject(context.rawHeaders);
		let token: string;

		token = headers?.["Authorization"]?.split(" ")[1];

		if (!token)
			return {
				error: lang === "ar" ? "مصادقة غير صالحة." : "Invalid Authentication.",
			};

		const isCustomAuth = token.length < 500;

		const tokenValidateion = jwt.decode(token);
		if (tokenValidateion?.exp * 1000 < new Date().getTime())
			return {
				error:
					lang === "ar"
						? "مصادقة غير صالحة وانتهت صلاحية jwt"
						: "Invalid Authentication and jwt expired",
			};

		let decodedData, userId;

		if (token && isCustomAuth) {
			decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

			userId = decodedData?.id;
		} else {
			decodedData = jwt.decode(token);

			userId = decodedData?.sub;
		}

		if (!mongoose.Types.ObjectId.isValid(userId))
			return {
				error: lang === "ar" ? "مصادقة غير صالحة." : "Invalid Authentication.",
			};

		const user: UserInterface | null =
			(await User.findById(userId).select("-password")) ||
			(await User.findOne({ email: decodedData.email }).select("-password"));

		if (!user)
			return {
				error: lang === "ar" ? "هذا المستخدم غير موجود" : "User not found",
			};

		return { user: user, error: "" };
	} catch (error) {
		return { error: error?.message };
	}
};

export default auth;
