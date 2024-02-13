import mongoose from "mongoose";
import Book, { BookInterface } from "../../models/book.js";

interface ContextInterface {
	query: {
		lang: string;
	};
}

const adminVerifyBook = async (bookId: string, context: ContextInterface) => {
	try {
		const { lang } = context.query;

		if (!bookId)
			return {
				error:
					lang === "ar"
						? "من فضلك ادخل معرف الكتاب"
						: "please, enter the book id",
				bookData: null,
			};

		if (!mongoose.Types.ObjectId.isValid(bookId)) {
			return {
				error: lang === "ar" ? "معرف الكتاب غير صالح" : "Invalid book id.",
				bookData: null,
			};
		}

		const bookData: BookInterface | null = await Book.findOne({
			_id: bookId,
			status: { $ne: "draft" },
		})
			.populate("categories")
			.populate("author")
			.populate("cover")
			.populate("sample");

		if (bookData === null) {
			return {
				bookData: null,
				error:
					lang === "ar"
						? "غير مسموح لك اى عمليات على هذه البيانات"
						: "You are not allowed to show this book data",
			};
		}

		return { bookData, error: null };
	} catch (error) {
		return { error: error.message, bookData: null };
	}
};

export default adminVerifyBook;