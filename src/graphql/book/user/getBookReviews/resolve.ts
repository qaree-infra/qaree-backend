import { auth } from "../../../../middleware/auth.js";
import BookReview from "../../../../models/bookReview.js";
import verifyBook from "../../../middleware/verifyBook.js";

const sortByValues = { createdAt: -1, rate: -1 };

const getBookReviews = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const { bookId } = args;

		const bookVerification = await verifyBook(bookId, context);
		if (bookVerification?.error) throw new Error(bookVerification?.error);

		const page = args?.page || 1;
		const limit = args?.limit || 10;
		const sort = args?.sort || "createdAt";

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

		const totalReviews = await BookReview.countDocuments({
			bookId,
		});

		const reviews = await BookReview.find({
			bookId,
		})
			.sort(sortFields)
			.limit(limit || 10)
			.skip(startIndex)
			.populate("user");

		return {
			reviews,
			total: totalReviews,
			currentPage: page ? Number(page) : totalReviews === 0 ? 0 : 1,
			numberOfPages: Math.ceil(totalReviews / (limit || 10)),
		};
	} catch (error) {
		console.log(error);
		throw new Error(error.message);
	}
};

export default getBookReviews;
