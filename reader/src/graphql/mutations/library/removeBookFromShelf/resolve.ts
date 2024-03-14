import mongoose from "mongoose";
import { auth } from "../../../../middleware/general/auth.js";
import verifyBook from "../../../middleware/verifyBook.js";
import Shelf, { ShelfInterface } from "../../../../models/shelf.js";
import { CURRENT_FINISHED_READING } from "../../../../utils/consts.js";

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

		const idValidation = mongoose.isObjectIdOrHexString(shelf);

		const orOptions = idValidation
			? [{ _id: shelf }]
			: [{ name_ar: shelf }, { name_en: shelf }];
		const shelfData: ShelfInterface = await Shelf.findOne({
			$or: orOptions,
		});

		if (!shelfData) throw new Error(lang ? "رف غير صالح" : "Invalid shelf");
		else {
			if (
				CURRENT_FINISHED_READING.filter(
					(s) => s === shelfData.name_ar || s === shelfData.name_en,
				).length
			)
				throw new Error(
					lang === "ar"
						? "عفواً، لا تستطيع حزف اى كتاب من هذا الرف"
						: "Sorry, you can't remove any books from this shelf",
				);

			await Shelf.findByIdAndUpdate(
				shelfData._id,
				{
					books: shelfData.books.filter((book) => String(book) !== bookId),
				},
				{ new: true },
			);

			return {
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
