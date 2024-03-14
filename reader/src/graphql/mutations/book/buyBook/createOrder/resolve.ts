import { auth } from "../../../../../middleware/general/auth.js";
import verifyBook from "../../../../../middleware/general/verifyBook.js";
import { createOrder } from "../../../../../utils/paypal/paypal-api.js";
import { CreatedOrder } from "../../../../../utils/paypal/order-type.js";

const resolve = async (_, args: { bookId: string }, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;
		if (auth.error) throw new Error(auth.error);

		const { bookId } = args;

		const bookVerification = await verifyBook(bookId, context);
		if (bookVerification.error) throw new Error(bookVerification.error);

		if (bookVerification.bookData.price === 0)
			throw new Error(lang === "ar" ? "هذا الكتاب مجانى" : "This is free book");

		const createdOrder: CreatedOrder = await createOrder(
			bookVerification.bookData.price,
			bookVerification.bookData.author.merchant_id,
		);

		if (createdOrder.status !== "CREATED")
			throw new Error("invalid order creation");

		return createdOrder;
	} catch (error) {
		throw new Error(error);
	}
};

export default resolve;
