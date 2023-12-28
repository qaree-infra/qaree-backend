import mongoose from "mongoose";
import { auth } from "../../../middleware/auth.js";
import verifyBook from "../../middleware/verifyBook.js";
import Shelf, { ShelfInterface } from "../../../models/shelf.js";

const removeBookFromShelfResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { bookId, shelf } = args;

		if (!shelf) {
			throw new Error(
				lang === "ar" ? "من فضلك ادخل الرف" : "please, enter the shelf",
			);
		}

		const bookVerification = await verifyBook(bookId, context);

		if (bookVerification?.error) throw new Error(bookVerification?.error);

		const orOptions = mongoose.Types.ObjectId.isValid(shelf)
			? [{ _id: shelf }]
			: [{ name: shelf }];
		const shelfData: ShelfInterface = await Shelf.findOne({
			$or: orOptions,
		});

		if (!shelfData) throw new Error(lang ? "رف غير صالح" : "Invalid shelf");
		else {
			const updatedShelf = await Shelf.findByIdAndUpdate(
				shelfData._id,
				{
					books: shelfData.books.filter((book) => String(book) !== bookId),
				},
				{ new: true },
			).populate("books");

			return {
				shelf: updatedShelf,
				message:
					lang === "ar"
						? "تم ازالة الكتاب من الرف بنجاح"
						: "Book have been remove succefully",
				success: true,
			};
		}
	} catch (error) {
		console.log(error);
		throw new Error(error.message);
	}
};

export default removeBookFromShelfResolve;
