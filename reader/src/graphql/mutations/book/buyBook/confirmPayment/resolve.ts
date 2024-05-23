import { auth } from "../../../../../middleware/general/auth.js";
import verifyBook from "../../../../../middleware/general/verifyBook.js";
import { capturePayment } from "../../../../../utils/paypal/paypal-api.js";
import { CapturedOrder } from "../../../../../utils/paypal/order-type.js";
import BookRead, { BookReadInterface } from "../../../../../models/bookRead.js";
import Offer, { OfferInterface } from "../../../../../models/offer.js";
import Shelf from "../../../../../models/shelf.js";
import {
	CURRENT_READING_SHELF,
	CURRENT_READING_SHELF_AR,
} from "../../../../../utils/consts.js";
import { getAuthorPaymentStatus } from "../../../../../utils/paypal/seller-paypal-api.js";

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
		console.log(bookId, orderId);

		const bookVerification = await verifyBook(bookId, context);
		if (bookVerification.error) throw new Error(bookVerification.error);

		const bookOffer: OfferInterface = await Offer.findOne({ book: bookId });
		const bookPrice =
			(100 - Number(bookOffer?.percent || 0)) * bookVerification.bookData.price;

		if (bookPrice === 0)
			throw new Error(lang === "ar" ? "هذا الكتاب مجانى" : "This is free book");

		if (!bookVerification.bookData.author.merchantId) {
			// todo: send email to ask the author to connect paypal with it's account

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
			// todo: send email to ask the author to connect paypal with it's account

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

		const capturedOrder: CapturedOrder = await capturePayment(
			orderId,
			bookVerification.bookData.author.merchantId,
		);
		console.log(capturedOrder);

		if (capturedOrder.status !== "COMPLETED")
			throw new Error("Uncompleted order");

		const purchasedBook: BookReadInterface = await BookRead.create({
			book: bookVerification.bookData._id,
			status: "purchased",
			readingProgress: 0,
			user: auth.user._id,
		});
		console.log(purchasedBook);
		const currentReadingShelf = await Shelf.findOne({
			name_ar: CURRENT_READING_SHELF_AR,
			name_en: CURRENT_READING_SHELF,
			userId: auth.user._id,
		});

		if (currentReadingShelf)
			await Shelf.findByIdAndUpdate(
				currentReadingShelf._id,
				{
					books: [bookVerification.bookData._id].concat(
						currentReadingShelf.books,
					),
				},
				{ new: true },
			);
		else {
			await Shelf.create({
				name_ar: CURRENT_READING_SHELF_AR,
				name_en: CURRENT_READING_SHELF,
				userId: auth.user._id,
				books: [bookVerification.bookData._id],
			});
		}

		return { capturedOrder, purchasedBook: purchasedBook };
	} catch (error) {
		throw new Error(error);
	}
};

export default resolve;
