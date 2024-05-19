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
