import { auth } from "../../../../middleware/general/auth.js";
import BookReview, {
	BookReviewInterface,
} from "../../../../models/bookReview.js";

const likeReview = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;

		if (auth.error) throw new Error(auth.error);

		const { reviewId } = args;

		const review: BookReviewInterface = await BookReview.findById(reviewId);

		if (!review) {
			throw new Error(lang === "ar" ? "مراجعة غير موجودة" : "Unfound review");
		}

		const likes: string[] = review.likes || [];

		if (likes.find((l) => l === auth.user._id.toString())) {
			await BookReview.findByIdAndUpdate(
				reviewId,
				{
					likes: likes.filter(
						(l) => l !== auth.user._id.toString(),
					),
				},
				{
					new: true,
				},
			);

			return { success: true, message: "Thanks for your opinion" };
		} else {
			await BookReview.findByIdAndUpdate(
				reviewId,
				{
					likes: likes.concat([auth.user._id.toString()]),
				},
				{
					new: true,
				},
			);

			return { success: true, message: "Thanks for your opinion" };
		}
	} catch (error) {
		console.log(error);
		throw new Error(error.message);
	}
};

export default likeReview;
