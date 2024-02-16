import Book from "../../../../../models/book.js";
import { adminAuth } from "../../../../../middleware/general/adminAuth.js";

const filterByValues = ["inReview", "published", "rejected"];
const sortByValues = ["updatedAt", "name", "price"];

const getBooks = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const adminAuth: adminAuth = context.adminAuth;

		if (adminAuth?.error) throw new Error(adminAuth?.error);

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

		if (sortBy && !sortByValues.includes(sortBy)) {
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
			/* todo: use status for filtering using status */
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
				.populate("file")
				.populate("sample");

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
				.populate("file")
				.populate("sample");

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
