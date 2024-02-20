import { NextFunction, Response } from "express";

import { AuthRequest, adminAuth } from "../general/adminAuth.js";

const Auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		const auth: adminAuth = req.adminAuth;

		if (auth?.error) {
			return res.status(401).json({ message: auth?.error });
		}

		next();
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export default Auth;
