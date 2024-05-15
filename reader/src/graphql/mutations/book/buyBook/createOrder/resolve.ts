import { auth } from "../../../../../middleware/general/auth.js";
import verifyBook from "../../../../../middleware/general/verifyBook.js";
import { createOrder } from "../../../../../utils/paypal/paypal-api.js";
import { CreatedOrder } from "../../../../../utils/paypal/order-type.js";
import BookRead from "../../../../../models/bookRead.js";
import Offer, { OfferInterface } from "../../../../../models/offer.js";

const resolve = async (_, args: { bookId: string }, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;
		if (auth.error) throw new Error(auth.error);

		const { bookId } = args;
		console.log(bookId);

		const bookVerification = await verifyBook(bookId, context);
		if (bookVerification.error) throw new Error(bookVerification.error);
		const bookOffer: OfferInterface = await Offer.findOne({ book: bookId });
		const bookPrice =
			(100 - Number(bookOffer?.percent || 0)) * bookVerification.bookData.price;

		if (bookPrice === 0)
			throw new Error(lang === "ar" ? "هذا الكتاب مجانى" : "This is free book");

		const userBookRead = await BookRead.findOne({
			book: bookId,
			status: "purchased",
			user: auth.user._id,
		});

		if (userBookRead)
			throw new Error(
				lang === "ar"
					? "لقد اشتريت الكتاب بالفعل"
					: "you have bought this book already",
			);

		const createdOrder: CreatedOrder = await createOrder(
			bookPrice,
			bookVerification.bookData.author.merchant_id,
		);
		console.log(createdOrder);

		if (createdOrder.status !== "CREATED")
			throw new Error("invalid order creation");

		return createdOrder;
	} catch (error) {
		throw new Error(error);
	}
};

export default resolve;
