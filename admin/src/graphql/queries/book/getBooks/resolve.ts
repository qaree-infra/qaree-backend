import Book from "../../../../models/book.js";
import { auth } from "../../../../middleware/general/auth.js";

const filterByValues = ["inReview", "published", "rejected"];
const sortByValues = { price: 1, updatedAt: -1, name: 1, publishionDate: -1 };

const getBooks = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { filterBy, sortBy } = args;
		const page = args?.page || 1;
		const limit = args?.limit || 10;
		const keyword = args?.keyword || "";

		if (filterBy && !filterByValues.includes(filterBy)) {
			throw new Error(
				lang === "ar"
					? "نأسف لانستطيع ان نرشح بيانات الكتب طبقاً لهذه القيمة"
					: "invalid filter by value",
			);
		}

		if (sortBy && !sortByValues[sortBy]) {
			throw new Error(
				lang === "ar"
					? "نأسف لا نستطيع ان نرتب بيانات الكتب حسب هذه القيمة"
					: "invalid sort by value",
			);
		}

		const sortFields = {};

		if (sortBy) {
			if (sortBy === "updatedAt") sortFields[sortBy] = -1;
			else sortFields[sortBy] = 1;
		}

		const startIndex = (Number(page) - 1) * limit;
		const keys = keyword
			?.trim()
			?.split(" ")
			.map((e: string) => new RegExp(e, "gi"));

		if (filterBy) {
			const totalBooks = await Book.countDocuments({
				status: filterBy,
				$or: [{ name: { $in: keys } }],
			});
			const books = await Book.find({
				status: filterBy,
				$or: [{ name: { $in: keys } }],
			})
				.sort(sortFields)
				.limit(limit || 10)
				.skip(startIndex)
				.populate("reviewer")
				.populate("categories")
				.populate("author")
				.populate("cover")
				.populate("file");

			return {
				books,
				currentPage: page ? Number(page) : totalBooks === 0 ? 0 : 1,
				numberOfPages: Math.ceil(totalBooks / (limit || 10)),
				total: totalBooks,
			};
		} else {
			const totalBooks = await Book.countDocuments({
				$or: [{ name: { $in: keys } }, { status: { $in: keys } }],
				status: { $ne: "draft" },
			});
			const books = await Book.find({
				$or: [{ name: { $in: keys } }, { status: { $in: keys } }],
				status: { $ne: "draft" },
			})
				.sort(sortFields)
				.limit(limit || 10)
				.skip(startIndex)
				.populate("reviewer")
				.populate("categories")
				.populate("author")
				.populate("cover")
				.populate("file");

			return {
				books,
				currentPage: page ? Number(page) : totalBooks === 0 ? 0 : 1,
				numberOfPages: Math.ceil(totalBooks / (limit || 10)),
				total: totalBooks,
			};
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default getBooks;
