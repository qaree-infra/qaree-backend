import mongoose from "mongoose";
import { auth } from "../../../../middleware/general/auth.js";
import verifyBook from "../../../middleware/verifyBook.js";
import Shelf, { ShelfInterface } from "../../../../models/shelf.js";
import { ShelfData } from "../../../types/shelf-type.js";
import {
	FINISHED_READING_SHELF,
	FINISHED_READING_SHELF_AR,
} from "../../../../utils/consts.js";
import BookRead from "../../../../models/bookRead.js";
import { isCurrentShelf } from "../../../../utils/helper.js";
import Offer, { OfferInterface } from "../../../../models/offer.js";

const addBookDetailsResolve = async (_, args, context) => {
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
			userId: auth.user._id,
		});

		const bookShelf: ShelfData = await Shelf.findOne({
			books: { $in: [bookVerification.bookData._id] },
			userId: auth.user._id,
		});

		if (shelfData) {
			if (
				shelfData.name_en === FINISHED_READING_SHELF ||
				shelfData.name_ar === FINISHED_READING_SHELF_AR
			)
				throw new Error(
					lang === "ar"
						? "عفواً، غير مسموح باضافة اى كتاب الى هذا الرف"
						: "Sorry, it is not allowed to add any book to this shelf",
				);

			if (String(bookShelf?._id) === String(shelfData._id)) {
				bookShelf.totalBooks = shelfData.books.length;
				bookShelf.name = lang === "ar" ? bookShelf.name_ar : bookShelf.name_en;
				return {
					success: true,
					message:
						lang === "ar" ? "تم اضافة الكتاب بنجاح" : "book added successfully",
				};
			}

			const validateCurrentShelf = isCurrentShelf(shelfData);

			if (validateCurrentShelf) {
				const bookOffer: OfferInterface = await Offer.findOne({ book: bookId });
				const bookPrice =
					(100 - bookOffer.percent) * bookVerification.bookData.price;
				await BookRead.create({
					book: bookVerification.bookData._id,
					status: bookPrice === 0 ? "purchased" : "sample",
					user: auth.user._id,
				});
			}

			// await Shelf.findByIdAndUpdate(bookShelf._id, {
			// 	books: bookShelf.books.filter(
			// 		(book) => book !== bookVerification.bookData._id,
			// 	),
			// });

			await Shelf.findByIdAndUpdate(
				shelfData._id,
				{ books: [bookVerification.bookData._id].concat(shelfData.books) },
				{ new: true },
			);

			return {
				success: true,
				message:
					lang === "ar" ? "تم اضافة الكتاب بنجاح" : "book added successfully",
			};
		} else {
			if (!idValidation) {
				throw new Error(lang ? "عنوان الرف غير صالح" : "Invalid shelf id");
			}

			await Shelf.create({
				name_ar: shelf,
				name_en: shelf,
				books: [bookVerification.bookData._id],
				userId: auth.user?._id,
			});

			return {
				success: true,
				message:
					lang === "ar" ? "تم اضافة الكتاب بنجاح" : "book added successfully",
			};
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default addBookDetailsResolve;
