import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const validateEmail = (email: string): boolean => {
	const re: RegExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
	return re.test(email);
};

export const generateOTPCode = () => {
	const min = 100000;
	const max = 999999;

	const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

	return randomNumber;
};

export const createAcessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
};

export const createPasswordResetPassword = (payload) => {
  return jwt.sign(payload, process.env.RESET_TOKEN_SECRET, { expiresIn: '1h' });
}

export const createRefrishToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" })
}
