import mongoose from "mongoose";
import Shelf from "../../../../models/shelf.js";
import { ShelfData } from "../../../types/shelf-type.js";
import { auth } from "../../../../middleware/general/auth.js";
import { CURRENT_FINISHED_READING } from "../../../../utils/consts.js";
import BookRead, { BookReadInterface } from "../../../../models/bookRead.js";

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

		const idValidation = mongoose.isObjectIdOrHexString(shelf);
		const orOptions = idValidation
			? [{ _id: shelf }]
			: [{ name_ar: shelf }, { name_en: shelf }];

		const startIndex = (Number(booksPage) - 1) * booksLimit;

		const shelfData: ShelfData = await Shelf.findOne({
			$or: orOptions,
			userId: user ? user : auth.user._id,
		}).populate({
			path: "books",
			options: {
				limit: booksLimit,
				skip: startIndex,
				populate: ["author", "cover", "categories"],
			},
		});

		if (!shelfData)
			throw new Error(lang === "ar" ? "هذا الرف غير موجود" : "not found shelf");

		const shelfDataBooks = (await Shelf.findById(shelfData._id).select("books"))
			.books;

		const relatedWithActivity = () =>
			CURRENT_FINISHED_READING.filter((s) => shelfData.name_en === s);

		shelfData.name = lang === "ar" ? shelfData.name_ar : shelfData.name_en;
		shelfData.currentBooksPage = booksPage;
		shelfData.totalBooks = shelfDataBooks.length;
		shelfData.numberOfBooksPages = Math.ceil(
			shelfDataBooks.length / (booksLimit || 10),
		);

		if (relatedWithActivity().length > 0 && auth.user._id === user) {
			const bookReads: BookReadInterface[] = await BookRead.find({
				user: auth.user._id,
				readingProgress: relatedWithActivity[0].includes("finished")
					? { $lt: 100, $gte: 0 }
					: { $eq: 100 },
			})
				.limit(booksLimit)
				.skip(startIndex);

			return {
				...shelfData,
				books: shelfData.books.map((b) => {
					const bookRead = bookReads.filter((br) => br.book === b._id)[0];
					if (bookRead) {
						return { ...bookRead, book: b };
					} else {
						return { book: b };
					}
				}),
			};
		} else {
			return { ...shelfData, books: shelfData.books.map((b) => ({ book: b })) };
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default getShelfResolve;
