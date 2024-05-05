import mongoose from "mongoose";
import Book, { BookInterface } from "../../models/book.js";

interface ContextInterface {
	query: {
		lang: string;
	};
}

const verifyBook = async (bookId: string, context: ContextInterface) => {
	try {
		const { lang } = context.query;

		if (!bookId)
			return {
				error:
					lang === "ar"
						? "من فضلك ادخل معرف الكتاب"
						: "please, enter the book id",
				bookData: null,
				statusCode: 400,
			};

		if (!mongoose.Types.ObjectId.isValid(bookId)) {
			return {
				error: lang === "ar" ? "معرف الكتاب غير صالح" : "Invalid book id.",
				bookData: null,
				statusCode: 400,
			};
		}

		const bookData: BookInterface | null = await Book.findOne({
			_id: bookId,
			status: { $ne: "draft" },
		})
			.populate("categories")
			.populate("author")
			.populate("cover")
			.populate("reviewer")
			.populate("file");

		if (bookData === null) {
			return {
				bookData: null,
				error:
					lang === "ar"
						? "غير مسموح لك اى عمليات على هذه البيانات"
						: "You are not allowed to show this book data",
				statusCode: 404,
			};
		}

		return { bookData, error: null, statusCode: 200 };
	} catch (error) {
		return { error: error.message, bookData: null, statusCode: 500 };
	}
};

export default verifyBook;
