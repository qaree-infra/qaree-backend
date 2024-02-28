import { Response, NextFunction } from "express";
import { BookInterface } from "../../models/book.js";
import { AuthRequest } from "../general/auth.js";
import verifyBook from "../general/verifyBook.js";

interface VerifyBookRequest extends AuthRequest {
	bookData: BookInterface;
}

const VerifyBook = async (
	req: VerifyBookRequest,
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

export default VerifyBook;
