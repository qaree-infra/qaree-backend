import mongoose from "mongoose";
import Book, { BookInterface } from "../../models/book.js";

const verifyBook = async (context, bookId, userId) => {
	try {
		const { lang } = context.query;

		if (!mongoose.Types.ObjectId.isValid(bookId)) {
			return {
				error: lang === "ar" ? "معرف الكتاب غير صالح" : "Invalid book id.",
				bookData: null,
				statusCode: 400,
			};
		}

		const bookData: BookInterface | null = await Book.findOne({
			_id: bookId,
			author: userId,
		})
			.populate("categories")
			.populate("author")
			.populate("cover")
			.populate("file")
			.populate("sample");

		if (bookData === null) {
			return {
				error:
					lang === "ar"
						? "غير مسموح لك اى عمليات على هذه البيانات"
						: "You are not allowed to show this book data",
				bookData: null,
				statusCode: 404,
			};
		}

		return { error: "", bookData, statusCode: 200 };
	} catch (error) {
		throw new Error(error);
	}
};

export default verifyBook;
