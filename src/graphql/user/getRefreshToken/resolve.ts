import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../../../models/user.js";
import { createAcessToken } from "../../../utils/helper.js";

function convertArrayToObject(arr: string[]): object {
	const result = {};

	for (let i = 0; i < arr.length; i += 2) {
		const key = arr[i];
		const value = arr[i + 1];

		result[key] = value;
	}

	return result;
}

const getRefreshToken = async (_, args, context) => {
	try {
		const headers = convertArrayToObject(context.rawHeaders);
		let token: string;

		token = headers?.["Authorization"]?.split(" ")[1];

		if (!token) throw new Error("Invalid Authentication.");

		const isCustomAuth = token.length < 500;

		const tokenValidateion = jwt.decode(token);
		if (tokenValidateion?.exp * 1000 < new Date().getTime())
			throw new Error("Invalid Authentication and jwt expired");

		let decodedData, userId;

		if (token && isCustomAuth) {
			decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

			userId = decodedData?.id;
		} else {
			decodedData = jwt.decode(token);

			userId = decodedData?.sub;
		}

		if (!mongoose.Types.ObjectId.isValid(userId))
			throw new Error("Invalid Authentication");

		const user =
			(await User.findById(userId).select("-password")) ||
			(await User.findOne({ email: decodedData.email }).select("-password"));

		if (!user) throw new Error("User not found");

		const refresh_token = createAcessToken({ email: user.email, id: user._id });

		return { refresh_token, message: "You are logged in successfully" };
	} catch (error) {
		throw new Error(error);
	}
};

export default getRefreshToken;
