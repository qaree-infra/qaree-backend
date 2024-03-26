import { auth } from "../../../../middleware/general/auth.js";
import verifyBook from "../../../../middleware/general/verifyBook.js";
import Book, { BookInterface } from "../../../../models/book.js";
import File, { FileInterface } from "../../../../models/file.js";

const deleteBookResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { bookId } = args;

		const bookVerification = await verifyBook(context, bookId, auth.user?._id);

		if (bookVerification?.error) throw new Error(bookVerification?.error);

		const updatedBook: BookInterface = await Book.findByIdAndUpdate(
			bookVerification.bookData._id,
			{ deleted: true },
			{
				new: true,
			},
		);

		await File.findByIdAndUpdate(
			bookVerification.bookData.cover,
			{
				deleted: true,
			},
			{ new: true },
		);

		await File.findByIdAndUpdate(
			bookVerification.bookData.file,
			{
				deleted: true,
			},
			{ new: true },
		);

		return {
			message:
				lang === "ar"
					? "تم نقل الكتاب الى سلة المحذوفات بنجاح"
					: "the book moved to recycle bin successfully",
			deleted_id: updatedBook._id,
			success: true,
		};
	} catch (error) {
		throw new Error(error);
	}
};

export default deleteBookResolve;
