import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import Admin, { AdminInterface } from "../models/admin.js";

export type adminAuth = {
	error?: string;
	admin?: AdminInterface;
};

export interface AuthRequest extends Request {
	adminAuth: adminAuth;
}

const adminAuth = async (
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
			req.adminAuth = {
				error: lang === "ar" ? "مصادقة غير صالحة." : "Invalid Authentication.",
			};

			return next();
		}

		const isCustomAuth = token?.length < 500;

		const tokenValidateion = jwt.decode(token);
		if (tokenValidateion?.exp * 1000 < new Date().getTime()) {
			req.adminAuth = {
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
			req.adminAuth = {
				error: lang === "ar" ? "مصادقة غير صالحة." : "Invalid Authentication.",
			};

			return next();
		}

		const admin: AdminInterface | null =
			(await Admin.findById(userId).select("-password")) ||
			(await Admin.findOne({ email: decodedData.email }).select("-password"));

		if (!admin) {
			req.adminAuth = {
				error: lang === "ar" ? "هذا المستخدم غير موجود" : "User not found",
			};

			return next();
		}

		req.adminAuth = { admin: admin, error: "" };

		next();
	} catch (error) {
		req.adminAuth = { error: error?.message };
		next();
	}
};

export default adminAuth;
