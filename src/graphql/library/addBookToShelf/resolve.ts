import mongoose from "mongoose";
import { auth } from "../../../middleware/auth.js";
import verifyBook from "../../middleware/verifyBook.js";
import Shelf, { ShelfInterface } from "../../../models/shelf.js";

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

		const orOptions = mongoose.Types.ObjectId.isValid(shelf)
			? [{ _id: shelf }]
			: [{ name: shelf }];
		const shelfData: ShelfInterface = await Shelf.findOne({
			$or: orOptions,
		}).populate("books");

		const bookShelf = await Shelf.findOne({
			books: { $in: [bookVerification.bookData._id] },
			userId: auth.user._id,
		});

		if (shelfData) {
			if (String(bookShelf?._id) === String(shelfData._id)) {
				return {
					success: true,
					shelf: shelfData,
					message:
						lang === "ar" ? "تم اضافة الكتاب بنجاح" : "book added successfully",
				};
			} else if (bookShelf) {
				await Shelf.findByIdAndUpdate(bookShelf._id, {
					books: bookShelf.books.filter(
						(book) => book !== bookVerification.bookData._id,
					),
				});
			}

			const updatedShelf: ShelfInterface = await Shelf.findByIdAndUpdate(
				shelfData._id,
				{ books: shelfData.books.concat([bookVerification.bookData._id]) },
				{ new: true },
			).populate("books");

			console.log("updatedShelf");
			return {
				success: true,
				shelf: updatedShelf,
				message:
					lang === "ar" ? "تم اضافة الكتاب بنجاح" : "book added successfully",
			};
		} else {
			if (mongoose.Types.ObjectId.isValid(shelf)) {
				throw new Error(lang ? "عنوان الرف غير صالح" : "Invalid shelf id");
			}

			const newShelf: ShelfInterface = await Shelf.create({
				name: shelf,
				books: [bookVerification.bookData._id],
				userId: auth.user?._id,
			});

			newShelf.books = [bookVerification.bookData];

			return {
				success: true,
				shelf: newShelf,
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
