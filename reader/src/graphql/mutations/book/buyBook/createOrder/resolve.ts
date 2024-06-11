import { auth } from "../../../../../middleware/general/auth.js";
import verifyBook from "../../../../../middleware/general/verifyBook.js";
import { createOrder } from "../../../../../utils/paypal/paypal-api.js";
import { CreatedOrder } from "../../../../../utils/paypal/order-type.js";
import BookRead from "../../../../../models/bookRead.js";
import Offer, { OfferInterface } from "../../../../../models/offer.js";
import { getAuthorPaymentStatus } from "../../../../../utils/paypal/seller-paypal-api.js";
import sendMail, {
	generateConnectPaypalMail,
} from "../../../../../utils/sendMail.js";

const resolve = async (_, args: { bookId: string }, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;
		if (auth.error) throw new Error(auth.error);

		const { bookId } = args;
		console.log(bookId);

		const bookVerification = await verifyBook(bookId, context);
		if (bookVerification.error) throw new Error(bookVerification.error);

		if (
			bookVerification.bookData.author._id.toString() ===
			auth.user._id.toString()
		) {
			throw new Error(
				lang === "ar"
					? "لا يمكنك شراء هذا الكتاب لانه كتابك"
					: "You can't buy this book because it's your book",
			);
		}

		const bookOffer: OfferInterface = await Offer.findOne({ book: bookId });
		const bookPrice =
			(100 - Number(bookOffer?.percent || 0)) * bookVerification.bookData.price;

		if (bookPrice === 0)
			throw new Error(lang === "ar" ? "هذا الكتاب مجانى" : "This is free book");

		if (!bookVerification.bookData.author.merchantId) {
			await sendMail(
				bookVerification.bookData.author.email,
				generateConnectPaypalMail(bookVerification.bookData.author.name),
			);

			throw new Error(
				lang === "ar"
					? "نأسف، هذا الكاتب لا يمكنه استقبال مدفوعاتك الان"
					: "Sorry, this author does not have ability to accept your payment now",
			);
		}

		const paymentStatus = await getAuthorPaymentStatus(
			bookVerification.bookData.author,
		);

		if (!paymentStatus.payments_receivable) {
			await sendMail(
				bookVerification.bookData.author.email,
				generateConnectPaypalMail(bookVerification.bookData.author.name),
			);

			throw new Error(
				lang === "ar"
					? "نأسف، هذا الكاتب لا يمكنه استقبال مدفوعاتك الان"
					: "Sorry, this author does not have ability to accept your payment now",
			);
		}

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
			bookVerification.bookData.author.merchantId,
		);
		console.log(createdOrder);

		if (createdOrder.status !== "CREATED")
			throw new Error("invalid order creation");

		return createdOrder;
	} catch (error) {
		throw new Error(error.message);
	}
};

export default resolve;
