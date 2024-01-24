import { auth } from "../../../../../middleware/auth.js";
import File from "../../../../../models/file.js";
import Book, { BookInterface } from "../../../../../models/book.js";
import verifyBookAuthor from "../../../../middleware/verifyBookAuthor.js";

const publishBookResolve = async (_, args: { bookId: string }, context) => {
	try {
		const { lang } = context.query;
		const auth: auth = context.auth;

		console.log(auth);

		if (auth?.error) throw new Error(auth?.error);

		const { bookId } = args;

		const { error, bookData } = await verifyBookAuthor(
			context,
			bookId,
			auth.user._id,
		);

		if (error) throw new Error(error);

		const bookFiles = await File.find({
			userId: auth.user._id,
			"for._id": bookData._id,
			"for.type": "book",
		});

		console.log(bookData);

		if (
			!bookData.name ||
			!bookData.description ||
			bookData.categories.length === 0 ||
			!bookData.edition ||
			!bookData.language ||
			bookFiles.length !== 3
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
		)
			.populate("categories")
			.populate("author")
			.populate("cover")
			.populate("file")
			.populate("sample");

		return { message: "published successfully", book: updatedBook };
	} catch (error) {
		throw new Error(error);
	}
};

export default publishBookResolve;
