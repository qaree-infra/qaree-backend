import { auth } from "../../../../../middleware/general/auth.js";
import verifyBook from "../../../../../middleware/general/verifyBook.js";
import { capturePayment } from "../../../../../utils/paypal/paypal-api.js";
import { CapturedOrder } from "../../../../../utils/paypal/order-type.js";
import BookRead, { BookReadInterface } from "../../../../../models/bookRead.js";

const resolve = async (
	_,
	args: { bookId: string; orderId: string },
	context,
) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;
		if (auth.error) throw new Error(auth.error);

		const { bookId, orderId } = args;

		const bookVerification = await verifyBook(bookId, context);
		if (bookVerification.error) throw new Error(bookVerification.error);

		if (bookVerification.bookData.price === 0)
			throw new Error(lang === "ar" ? "هذا الكتاب مجانى" : "This is free book");

		const capturedOrder: CapturedOrder = await capturePayment(
			orderId,
			bookVerification.bookData.author.merchant_id,
		);

		if (capturedOrder.status !== "COMPLETED")
			throw new Error("Uncompleted order");

		const purchasedBook: BookReadInterface = await BookRead.create({
			book: bookVerification.bookData._id,
			status: "purchased",
			readingProgress: 0,
			user: auth.user._id,
		});

		return { capturedOrder, purchasedBook: purchasedBook };
	} catch (error) {
		throw new Error(error);
	}
};

export default resolve;
