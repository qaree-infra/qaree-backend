import { auth } from "../../../../middleware/general/auth.js";
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
				populate: ["author", "sample", "cover", "categories"],
				options: { limit: 3, skip: 0 },
			});

		return {
			shelves: shelves.map((s) => ({
				...s,
				name: lang === "ar" ? s.name_ar : s.name_en,
				books: s.books.map((b) => ({ book: b })),
			})),
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
