import mongoose from "mongoose";
import Shelf from "../../../models/shelf.js";
import { ShelfData } from "../shelf-type.js";
import { auth } from "../../../middleware/auth.js";

interface Args {
	shelf: string;
	user?: string;
	booksLimit?: number;
	booksPage?: number;
}

const getShelfResolve = async (_, args: Args, context) => {
	try {
		const { lang } = context.query;

		const { shelf, user } = args;
		const booksLimit = args?.booksLimit || 10;
		const booksPage = args?.booksPage || 1;

		const auth: auth = context.auth;

		if (!user && auth.error) throw new Error(auth.error);

		const orOptions = mongoose.Types.ObjectId.isValid(shelf)
			? [{ _id: shelf }]
			: [{ name: shelf }];

		const startIndex = (Number(booksPage) - 1) * booksLimit;

		const shelfData: ShelfData = await Shelf.findOne({
			$or: orOptions,
			userId: user ? user : auth.user._id,
		}).populate({
			path: "books",
			options: { limit: booksLimit, skip: startIndex },
		});

		if (!shelfData)
			throw new Error(lang === "ar" ? "هذا الرف غير موجود" : "not found shelf");

		const shelfDataBooks = (await Shelf.findById(shelfData._id)).books;

		shelfData.currentBooksPage = booksPage;
		shelfData.totalBooks = shelfDataBooks.length;
		shelfData.numberOfBooksPages = Math.ceil(
			shelfDataBooks.length / (booksLimit || 10),
		);

		return shelfData;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default getShelfResolve;
