import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import Book, { BookInterface } from "../models/book.js";
import { AuthRequest } from "./general/auth.js";

const VerifyBook = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params;
		const { lang } = req.query;
		const { _id } = req.auth.user;

		if (!mongoose.Types.ObjectId.isValid(id))
			return res.status(400).json({
				message: lang === "ar" ? "معرف الكتاب غير صالح" : "Invalid book id.",
			});

		const bookData: BookInterface | null = await Book.findOne({
			_id: id,
			author: _id.toString(),
		});

		if (bookData === null) {
			return res.status(400).json({
				message:
					lang === "ar"
						? "غير مسموح لك اى عمليات على هذه البيانات"
						: "You are not allowed to show this book data",
			});
		}

		next();
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export default VerifyBook;
