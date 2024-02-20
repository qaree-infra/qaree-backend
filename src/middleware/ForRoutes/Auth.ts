import { NextFunction, Response } from "express";

import { AuthRequest, auth } from "../general/auth.js";

const Auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		const auth: auth = req.auth;

		if (auth?.error) {
			return res.status(401).json({ message: auth?.error });
		}

		next();
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export default Auth;
