import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ShelfData } from "../graphql/types/shelf-type.js";
import {
	CURRENT_READING_SHELF,
	CURRENT_READING_SHELF_AR,
	FINISHED_READING_SHELF,
	FINISHED_READING_SHELF_AR,
} from "./consts.js";

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
		expiresIn: "30d", // default expires in 24 days
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

export const isCurrentShelf = (shelfData: ShelfData) => {
	return (
		shelfData.name_en === CURRENT_READING_SHELF ||
		shelfData.name_ar === CURRENT_READING_SHELF_AR
	);
};

export const isFinishedShelf = (shelfData: ShelfData) => {
	return (
		shelfData.name_en === FINISHED_READING_SHELF ||
		shelfData.name_ar === FINISHED_READING_SHELF_AR
	);
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
