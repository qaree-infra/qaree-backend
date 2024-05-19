import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "24h",
	});
};

export const createAdminAccessToken = (payload) => {
	return jwt.sign(payload, process.env.ADMIN_ACCESS_TOKEN_SECRET, {
		expiresIn: "24h",
	});
};

export const createPasswordResetToken = (payload) => {
	return jwt.sign(payload, process.env.RESET_TOKEN_SECRET, { expiresIn: "1h" });
};

export const createRefrishToken = (payload) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "30d",
	});
};

export function convertKeys<T>(obj) {
	if (typeof obj !== "object" || obj === null) return obj;

	if (Array.isArray(obj)) {
		return obj.map(convertKeys);
	}

	const newObj = {};
	for (const key in obj) {
		const newKey = key.replace(/(_([a-z]))/g, (match, p1) => match[1].toUpperCase());
		console.log(newKey);
		newObj[newKey] = convertKeys(obj[key]);
	}
	return newObj;
}

export const parseURL = (url: string) => {
	const symbolMap = {
		"%": "%25",
		"@": "%40",
		" ": "%20",
		'"': "%22",
		"'": "%27",
		",": "%2C",
		";": "%3B",
		"<": "%3C",
		">": "%3E",
		"[": "%5B",
		"]": "%5D",
		"|": "%7C",
		"}": "%7D",
		"{": "%7B",
	};

	const regex = new RegExp("[" + Object.keys(symbolMap).join("") + "]", "g");

	try {
		const result = url.replace(regex, (match) => symbolMap[match]);
		console.log(result);
		return result;
	} catch (error) {
		console.error("Error decoding URL:", error, url);
		// Handle the error (e.g., return a default URL or log a message)
		return url; // Or return a placeholder value
	}
};
