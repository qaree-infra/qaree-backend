import Book, { BookInterface } from "../../../../models/book.js";

const sortByValues = { readers: -1, publishionDate: -1, avgRate: -1 };

export default async function getAuthorBooks(_, args, context) {
	try {
		const { lang } = context.query;

		const { userId } = args;
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
		const totalBooks = await Book.countDocuments({
			status: "published",
			author: userId,
		});

		const books: BookInterface[] = await Book.find({
			status: "published",
			author: userId,
		})
			.sort(sortFields)
			.limit(limit || 10)
			.skip(startIndex)
			.populate("categories")
			.populate("cover");

		return {
			books,
			currentPage: page ? Number(page) : totalBooks === 0 ? 0 : 1,
			numberOfPages: Math.ceil(totalBooks / (limit || 10)),
			total: totalBooks,
		};
	} catch (error) {
		console.error(error);
		throw new Error(error.message);
	}
}
