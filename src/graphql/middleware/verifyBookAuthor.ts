import mongoose from "mongoose";
import Book, { BookInterface } from "../../models/book.js";

const verifyBookAuthor = async (context, bookId, userId) => {
	try {
		const { lang } = context.query;

		if (!mongoose.Types.ObjectId.isValid(bookId)) {
			return {
				error: lang === "ar" ? "معرف الكتاب غير صالح" : "Invalid book id.",
			};
		}

		const bookData: BookInterface | null = await Book.findOne({
			_id: bookId,
			author: userId,
		})
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
			};
		}

		return { error: "", bookData };
	} catch (error) {
		throw new Error(error);
	}
};

export default verifyBookAuthor;
