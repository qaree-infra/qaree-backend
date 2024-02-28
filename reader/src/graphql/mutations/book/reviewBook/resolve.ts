import { auth } from "../../../../middleware/general/auth.js";
import BookReview from "../../../../models/bookReview.js";
import verifyBook from "../../../middleware/verifyBook.js";

interface ArgsInterface {
	bookId: string;
	content: string;
	rate: number;
}

const reviewBookResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;
		const { error, user }: auth = context.auth;

		if (error) throw new Error(error);

		const { bookId, content, rate } = args;

		const bookVerification = await verifyBook(bookId, context);

		if (bookVerification?.error) throw new Error(bookVerification?.error);

		if (!rate)
			throw new Error(
				lang === "ar" ? "من فضلك ادخل تقيمك" : "please, enter your review rate",
			);

		if (!content)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل محتوى المراجعة"
					: "please, enter the review content",
			);

		const oldReview = await BookReview.findOne({ user: user._id, bookId });

		if (oldReview) {
			const review = await BookReview.findByIdAndUpdate(oldReview._id, {
				rate,
				content,
			});

			return {
				message:
					lang === "ar"
						? "تم تعديل مراجعتك بنجاح"
						: "Your review have been updated successfully",
				review,
			};
		} else {
			const review = await BookReview.create({
				user: user._id,
				rate,
				content,
			});

			return {
				message:
					lang === "ar" ? "شكراً لك على مراجعتك" : "Thanks for your review",
				review,
			};
		}
	} catch (error) {
		console.log(error);
		throw new Error(error.message);
	}
};

export default reviewBookResolve;
