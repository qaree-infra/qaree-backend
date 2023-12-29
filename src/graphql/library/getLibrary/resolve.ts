import { auth } from "../../../middleware/auth.js";
import Shelf from "../../../models/shelf.js";
import { ShelfData } from "../shelf-type.js";

interface Args {
	user?: string;
	limit?: number;
	page?: number;
	limitBooks?: number;
}

const getLibraryResolve = async (_, args: Args, context) => {
	try {
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
				populate: ["author", "sample", "cover"],
				options: { limit: 3, skip: 0 },
			});

		return {
			shelves: shelves,
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
