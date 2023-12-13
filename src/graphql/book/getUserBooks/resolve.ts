import Book from "../../../models/book.js";
import authMiddleware, { AuthInterface } from "../../middleware/auth.js";

const filterByValues = ["draft", "inReview", "published", "rejected"];
const sortByValues = ["updatedAt", "name", "price"];

/**
 * use population method on
 */
const getUserBooksResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;
		const auth: AuthInterface = await authMiddleware(context);

		if (auth?.error) throw new Error(auth?.error);

		const { filterBy, sortBy, page, limit, keyword } = args;

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

		if (sortBy) sortFields[sortBy] = 1;

		const startIndex = (Number(page || 1) - 1) * (limit || 0);

		const keys = keyword
			?.trim()
			?.split(" ")
			.map((e: string) => new RegExp(e, "gi"));
		if (filterBy) {
			/* todo: use status for filtering using status */
			const totalBooks = await Book.countDocuments({
				authorId: auth.user._id,
				$or: [
					{ name: { $in: keys } },
					// { status: { $in: keys } }, // uncommet after adding status
				],
			});
			const books = await Book.find({
				authorId: auth.user._id,
				// status: filterBy,
				$or: [
					{ name: { $in: keys } },
					// { status: { $in: keys } }, // uncommet after adding status
				],
			})
				.sort(sortFields)
				.limit(limit || 10)
				.skip(startIndex);

			return {
				books,
				currentPage: page ? Number(page) : totalBooks === 0 ? 0 : 1,
				numberOfPages: Math.ceil(totalBooks / (limit || 10)),
				total: totalBooks,
			};
		} else {
			const totalBooks = await Book.countDocuments({ authorId: auth.user._id });
			const books = await Book.find({
				authorId: auth.user._id,
				$or: [
					{ name: { $in: keys } },
					// { status: { $in: keys } }, // uncommet after adding status
				],
			})
				.sort(sortFields)
				.limit(limit || 10)
				.skip(startIndex);

			return {
				books,
				currentPage: page ? Number(page) : totalBooks === 0 ? 0 : 1,
				numberOfPages: Math.ceil(totalBooks / (limit || 10)),
				total: totalBooks,
			};
		}
	} catch (error) {
		throw new Error(error);
	}
};

export default getUserBooksResolve;
