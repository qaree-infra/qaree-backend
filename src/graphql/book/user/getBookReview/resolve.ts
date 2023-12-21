import mongoose from "mongoose";
import { auth } from "../../../../middleware/auth.js";
import BookReview, {
	BookReviewInterface,
} from "../../../../models/bookReview.js";

const getReview = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const { reviewId } = args;

		if (!reviewId)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل معرف المراجعة"
					: "please, enter the review id",
			);

		if (!mongoose.Types.ObjectId.isValid(reviewId)) {
			throw new Error(
				lang === "ar" ? "معرف المراجعة غير صالح" : "Invalid review id.",
			);
		}

		const review: BookReviewInterface | null = await BookReview.findById(
			reviewId,
		).populate("user");

		if (!review)
			throw new Error(
				lang === "ar" ? "هذا المراجعة غير موجود" : "Unfound review",
			);

		return review;
	} catch (error) {
		console.log(error);
		throw new Error(error.message);
	}
};

export default getReview;
