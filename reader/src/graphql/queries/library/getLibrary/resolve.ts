import { auth } from "../../../../middleware/general/auth.js";
import { BookInterface } from "../../../../models/book.js";
import Shelf from "../../../../models/shelf.js";
import { ShelfData } from "../../../types/shelf-type.js";

interface Args {
	user?: string;
	limit?: number;
	page?: number;
	limitBooks?: number;
}

const getLibraryResolve = async (_, args: Args, context) => {
	try {
		const { lang } = context.query;
		const { user } = args;
		const limit = args?.limit || 10;
		const page = args?.page || 1;
		const startIndex = (Number(page) - 1) * limit;

		const auth: auth = context.auth;

		if (auth.error && !user) throw new Error(auth.error);

		const totalShelves = await Shelf.countDocuments({
			userId: user ? user : auth.user?._id.toString(),
		});

		const shelves: Array<ShelfData> = await Shelf.find({
			userId: user ? user : auth.user?._id.toString(),
		})
			.limit(limit)
			.skip(startIndex)
			.populate({
				path: "books",
				populate: ["author", "cover", "categories"],
				options: { limit: 3, skip: 0 },
			});

		const totalBooksAtShelves = await Shelf.aggregate([
			{
				$match: {
					userId: user ? user : auth.user?._id.toString(),
				},
			},
			{
				$limit: limit,
			},
			{
				$skip: startIndex,
			},
			{
				$addFields: {
					totalBooks: { $size: "$books" },
				},
			},
			{
				$project: {
					_id: 1,
					totalBooks: 1,
				},
			},
		]);

		return {
			shelves: shelves.map((s) => {
				const totalBooks = totalBooksAtShelves.find((t) => t._id === s._id);
				return {
					...s,
					_id: s._id,
					name: lang === "ar" ? s.name_ar : s.name_en,
					books: s.books.map((b) => ({ book: b })),
					totalBooks: totalBooks ? totalBooks.totalBooks : s.books.length,
					numberOfBooksPages: totalBooks ? totalBooks.totalBooks / 3 : 0,
					currentBooksPage: 1,
					createdAt: s.createdAt,
					updatedAt: s.updatedAt,
				};
			}),
			total: totalShelves,
			currentPage: page,
			numberOfPages: Math.ceil(totalShelves / limit),
		};
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default getLibraryResolve;
