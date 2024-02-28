import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const validateEmail = (email: string): boolean => {
	const re: RegExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
	return re.test(email);
};

export const createAccessToken = (payload) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "24h",
	});
};
