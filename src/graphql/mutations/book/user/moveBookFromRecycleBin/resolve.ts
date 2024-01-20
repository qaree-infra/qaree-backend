import { auth } from "../../../../../middleware/auth.js";
import verifyBookAuthor from "../../../../middleware/verifyBookAuthor.js";
import Book, { BookInterface } from "../../../../../models/book.js";

const deleteBookResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { bookId } = args;

		const verifyBook = await verifyBookAuthor(context, bookId, auth.user?._id);

		if (verifyBook?.error) throw new Error(verifyBook?.error);

		const updatedBook: BookInterface = await Book.findByIdAndUpdate(
			verifyBook.bookData._id,
			{ deleted: false },
			{
				new: true,
			},
		);

		return {
			message:
				lang === "ar"
					? "تم نقل الكتاب من سلة المحذوفات بنجاح"
					: "the book moved from recycle bin successfully",
			deleted_id: updatedBook._id,
			success: true,
		};
	} catch (error) {
		throw new Error(error);
	}
};

export default deleteBookResolve;
