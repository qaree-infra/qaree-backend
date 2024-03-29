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
			};

		if (!mongoose.Types.ObjectId.isValid(bookId)) {
			return {
				error: lang === "ar" ? "معرف الكتاب غير صالح" : "Invalid book id.",
				bookData: null,
			};
		}

		const bookData: BookInterface | null = await Book.findOne({
			_id: bookId,
			status: "published",
		})
			.populate("categories")
			.populate("author")
			.populate("cover")
			.populate("sample");

		if (bookData === null) {
			return {
				error: lang === "ar" ? "هذا الكتاب غير موجود" : "Unfound book",
				bookData: null,
			};
		}

		return { bookData, error: "" };
	} catch (error) {
		return { error: error.message, bookData: null };
	}
};

export default verifyBook;
