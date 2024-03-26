import { auth } from "../../../../middleware/general/auth.js";
import File from "../../../../models/file.js";
import Book, { BookInterface } from "../../../../models/book.js";
import verifyBook from "../../../../middleware/general/verifyBook.js";

const publishBookResolve = async (_, args: { bookId: string }, context) => {
	try {
		const { lang } = context.query;
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { bookId } = args;

		const { error, bookData } = await verifyBook(
			context,
			bookId,
			auth.user._id,
		);

		if (error) throw new Error(error);

		const bookFiles = await File.find({
			_id: { $in: [bookData.file, bookData.cover] },
		});

		if (
			!bookData.name ||
			!bookData.description ||
			bookData.categories.length === 0 ||
			!bookData.edition ||
			!bookData.language ||
			bookFiles.length !== 2
		) {
			throw new Error(
				lang === "ar"
					? "من فضلك اكمل بيانات الكتاب"
					: "please complete the book data",
			);
		}

		const updatedBook: BookInterface = await Book.findByIdAndUpdate(
			bookData._id,
			{ status: "inReview" },
			{ new: true },
		)
			.populate("categories")
			.populate("author")
			.populate("cover")
			.populate("file");

		return { message: "published successfully", book: updatedBook };
	} catch (error) {
		throw new Error(error);
	}
};

export default publishBookResolve;
