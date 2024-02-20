import { Response, NextFunction } from "express";
import { BookInterface } from "../../models/book.js";
import { AuthRequest } from "../general/auth.js";
import verifyBook from "../general/verifyBook.js";
import verifyBookAuthor from "../general/verifyBookAuthor.js";
import adminVerifyBook from "../general/adminVerifyBook.js";

interface VerifyBook extends AuthRequest {
	bookData: BookInterface;
}

export const VerifyBook = async (
	req: VerifyBook,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params;
		const { lang } = req.query;

		const {
			error,
			bookData,
			statusCode,
		}: { error?: string; bookData?: BookInterface; statusCode: number } =
			await verifyBook(id, { query: { lang: lang === "ar" ? "ar" : "en" } });

		if (error) return res.status(statusCode).json({ message: error });

		req.bookData = bookData;

		next();
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const VerifyBookAuthor = async (
	req: VerifyBook,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params;
		const { lang } = req.query;

		const {
			error,
			bookData,
			statusCode,
		}: { error?: string; bookData?: BookInterface; statusCode: number } =
			await verifyBookAuthor(
				{ query: { lang: lang === "ar" ? "ar" : "en" } },
				id,
				req.auth.user._id,
			);

		if (error) return res.status(statusCode).json({ message: error });

		req.bookData = bookData;

		next();
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const VerifyBookAdmin = async (
	req: VerifyBook,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params;
		const { lang } = req.query;

		const {
			error,
			bookData,
			statusCode,
		}: { error?: string; bookData?: BookInterface; statusCode: number } =
			await adminVerifyBook(id, {
				query: { lang: lang === "ar" ? "ar" : "en" },
			});

		if (error) return res.status(statusCode).json({ message: error });

		req.bookData = bookData;

		next();
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
