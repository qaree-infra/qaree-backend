import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User, { UserInterface } from "../../models/user.js";

const authSocket = async (socket, next) => {
	try {
		const lang = socket.handshake.headers["accept-language"];
		console.log(lang);
		let token: string = "";

		if (socket.handshake.auth.token || socket.handshake.headers.authorization)
			token =
				socket.handshake.auth.token.split("Bearer ")[1] ||
				socket.handshake.headers.authorization.split("Bearer ")[1];

		if (!token) {
			return next(
				new Error(
					lang === "ar" ? "مصادقة غير صالحة." : "Invalid Authentication.",
				),
			);
		}

		const isCustomAuth = token?.length < 500;

		const tokenValidateion = jwt.decode(token);
		if (tokenValidateion?.exp * 1000 < new Date().getTime()) {
			return next(
				new Error(
					lang === "ar"
						? "مصادقة غير صالحة وانتهت صلاحية jwt"
						: "Invalid Authentication and jwt expired",
				),
			);
		}

		let decodedData: { id?: string; sub?: string; email: string },
			userId: string;

		if (token && isCustomAuth) {
			decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

			userId = decodedData?.id;
		} else {
			decodedData = jwt.decode(token);

			userId = decodedData?.sub;
		}

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return next(
				new Error(
					lang === "ar" ? "مصادقة غير صالحة." : "Invalid Authentication.",
				),
			);
		}

		const user: UserInterface | null =
			(await User.findById(userId).select("-password").populate("avatar")) ||
			(await User.findOne({ email: decodedData.email })
				.select("-password")
				.populate("avatar"));

		if (!user) {
			return next(
				new Error(lang === "ar" ? "هذا المستخدم غير موجود" : "User not found"),
			);
		}

		socket.handshake.authData = { user: user, error: "" };

		return next();
	} catch (error) {
		console.error(error);
		return next(new Error(error.message));
	}
};

export default authSocket;
