import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import User, { UserInterface } from "../../models/user.js";

export type auth = {
	error?: string;
	user?: UserInterface;
};

export interface AuthRequest extends Request {
	auth: auth;
}

interface tokenValidateion extends jwt.JwtPayload {
	exp: number;
}

interface DecodedData extends jwt.JwtPayload {
	id?: string;
	sub?: string;
	email: string;
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		const { lang } = req.query;
		let token: string = "";

		if (req?.headers?.authorization)
			token = req.headers?.authorization?.split("Bearer ")[1];

		if (!token) {
			req.auth = {
				error: lang === "ar" ? "مصادقة غير صالحة." : "Invalid Authentication.",
			};

			return next();
		}

		const isCustomAuth = token?.length < 500;

		const tokenValidateion: tokenValidateion = jwt.decode(
			token,
		) as tokenValidateion;
		if (tokenValidateion?.exp * 1000 < new Date().getTime()) {
			req.auth = {
				error:
					lang === "ar"
						? "مصادقة غير صالحة وانتهت صلاحية jwt"
						: "Invalid Authentication and jwt expired",
			};

			return next();
		}

		let decodedData: DecodedData, userId: string;

		if (token && isCustomAuth) {
			decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as DecodedData;

			userId = decodedData?.id;
		} else {
			decodedData = jwt.decode(token) as DecodedData;

			userId = decodedData?.sub;
		}

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			req.auth = {
				error: lang === "ar" ? "مصادقة غير صالحة." : "Invalid Authentication.",
			};

			return next();
		}

		const user: UserInterface | null =
			(await User.findById(userId).select("-password")) ||
			(await User.findOne({ email: decodedData.email }).select("-password"));

		if (!user) {
			req.auth = {
				error: lang === "ar" ? "هذا المستخدم غير موجود" : "User not found",
			};

			return next();
		}

		req.auth = { user: user, error: "" };

		next();
	} catch (error) {
		req.auth = { error: error?.message };
		next();
	}
};

export default auth;
