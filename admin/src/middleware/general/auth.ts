import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import Admin, { AdminInterface } from "../../models/admin.js";

export type auth = {
	error?: string;
	admin?: AdminInterface;
};

export interface AuthRequest extends Request {
	auth: auth;
}

const auth = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
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

		const tokenValidateion = jwt.decode(token);
		if (tokenValidateion?.exp * 1000 < new Date().getTime()) {
			req.auth = {
				error:
					lang === "ar"
						? "مصادقة غير صالحة وانتهت صلاحية jwt"
						: "Invalid Authentication and jwt expired",
			};

			return next();
		}

		let decodedData: { id?: string; sub?: string; email: string },
			userId: string;

		if (token && isCustomAuth) {
			decodedData = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);

			userId = decodedData?.id;
		} else {
			decodedData = jwt.decode(token);

			userId = decodedData?.sub;
		}

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			req.auth = {
				error: lang === "ar" ? "مصادقة غير صالحة." : "Invalid Authentication.",
			};

			return next();
		}

		const admin: AdminInterface | null =
			(await Admin.findById(userId).select("-password")) ||
			(await Admin.findOne({ email: decodedData.email }).select("-password"));

		if (!admin) {
			req.auth = {
				error: lang === "ar" ? "هذا المستخدم غير موجود" : "User not found",
			};

			return next();
		}

		req.auth = { admin: admin, error: "" };

		next();
	} catch (error) {
		req.auth = { error: error?.message };
		next();
	}
};

export default auth;
