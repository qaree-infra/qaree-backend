import Book, { BookInterface } from "../../../../../models/book.js";

const sortByValues = { readers: -1, publishionDate: -1, avgRate: -1 };

const bookSearch = async (_, args, context) => {
	try {
		const { lang } = context.query;
		const { keyword, categories } = args;

		const sort = args?.sort || "avgRate";
		const page = args?.page || 1;
		const limit = args?.limit || 10;

		const keys = keyword
			?.trim()
			?.split(" ")
			.map((e) => new RegExp(e, "gi"));

		const sortFields = {};

		if (sort && !sortByValues[sort]) {
			throw new Error(
				lang === "ar"
					? "نأسف لا نستطيع ان نرتب بيانات الكتب حسب هذه القيمة"
					: "invalid sort by value",
			);
		}

		if (sort) {
			sortFields[sort] = sortByValues[sort];
		}

		const totalBooks = await Book.countDocuments({
			status: "published",
			categories: { $in: categories },
			name: { $in: keys }
		});
		
		const startIndex = (Number(page) - 1) * limit;
		const books: Array<BookInterface> = await Book.find({
			status: "published",
			categories: {
				$in: categories,
			},
			name: { $in: keys }
		})
			.sort(sortFields)
			.limit(limit || 10)
			.skip(startIndex)
			.populate("author")
			.populate("cover")
			.populate("sample");

		return {
			books,
			currentPage: page ? Number(page) : totalBooks === 0 ? 0 : 1,
			numberOfPages: Math.ceil(totalBooks / (limit || 10)),
			total: totalBooks,
		};
	} catch (error) {
		throw new Error(error);
	}
};

export default bookSearch;
