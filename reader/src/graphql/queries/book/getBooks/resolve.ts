import Book, { BookInterface } from "../../../../models/book.js";

const sortByValues = { readers: -1, publishionDate: -1, avgRate: -1 };

interface ArgsInterface {
	category: string;
	page?: number;
	limit?: number;
	sort?: string;
}

const getBooksResolve = async (_, args: ArgsInterface, context) => {
	try {
		const { lang } = context.query;

		const { category } = args;
		const page = args?.page || 1;
		const limit = args?.limit || 10;
		const sort = args?.sort || "avgRate";

		if (sort && !sortByValues[sort]) {
			throw new Error(
				lang === "ar"
					? "نأسف لا نستطيع ان نرتب بيانات الكتب حسب هذه القيمة"
					: "invalid sort by value",
			);
		}

		const sortFields = {};

		if (sort) {
			sortFields[sort] = sortByValues[sort];
		}

		const startIndex = (Number(page) - 1) * limit;

		if (category) {
			const totalBooks = await Book.countDocuments({
				status: "published",
				categories: {
					$in: [category],
				},
			});

			const books: BookInterface[] = await Book.find({
				status: "published",
				categories: {
					$in: [category],
				},
			})
				.sort(sortFields)
				.limit(limit || 10)
				.skip(startIndex)
				.populate("categories")
				.populate("author")
				.populate("cover")
				.populate("sample");

			return {
				books,
				currentPage: page ? Number(page) : totalBooks === 0 ? 0 : 1,
				numberOfPages: Math.ceil(totalBooks / (limit || 10)),
				total: totalBooks,
			};
		} else {
			const totalBooks = await Book.countDocuments({
				status: "published",
			});

			const books: BookInterface[] = await Book.find({
				status: "published",
			})
				.sort(sortFields)
				.limit(limit || 10)
				.skip(startIndex)
				.populate("categories")
				.populate("author")
				.populate("cover")
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
		throw new Error(error.message);
	}
};

export default getBooksResolve;
