import Book, { BookInterface } from "../../../../../models/book.js";
import { auth } from "../../../../../middleware/auth.js";
import verifyBookAuthor from "../../../../middleware/verifyBookAuthor.js";

const editBookDetails = async (_, args, context) => {
	try {
		const { lang } = context.query;
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const {
			bookId,
			name,
			description,
			isbn,
			edition,
			language,
			publishingRights,
			categories,
			price,
		} = args;

		const verifyBook = await verifyBookAuthor(context, bookId, auth.user?._id);

		if (verifyBook?.error) throw new Error(verifyBook?.error);

		if (
			name === undefined &&
			description === undefined &&
			isbn === undefined &&
			edition === undefined &&
			language === undefined &&
			publishingRights === undefined &&
			categories === undefined &&
			price === undefined
		)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل بيانات الكتاب"
					: "please, enter the book details",
			);

		if (name !== undefined && name.length === 0)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل اسم الكتاب"
					: "please, enter the book name",
			);

		if (description !== undefined && description.length === 0)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل وصف الكتاب"
					: "please, enter the book description",
			);

		if (isbn && isbn.length < 10) {
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل رقم ISBN صالح"
					: "please, enter a valid ISBN",
			);
		}

		if (edition !== undefined && edition < 1)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل اصدار صالح"
					: "please, enter a valid book edition",
			);

		if (price && price < 1 && price > 100000)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل سعر صالح"
					: "please, enter a valid book price",
			);

		let newBook = Object.assign(verifyBook.bookData, {
			name,
			description,
			isbn,
			edition,
			language,
			publishingRights,
			categories,
			price,
		});

		const updatedBook: BookInterface = await Book.findByIdAndUpdate(
			verifyBook.bookData._id,
			newBook,
			{
				new: true,
			},
		)
			.populate("author")
			.populate("cover")
			.populate("file")
			.populate("sample");

		return updatedBook;
	} catch (error) {
		throw new Error(error);
	}
};

export default editBookDetails;
