import { adminAuth } from "../../../../../middleware/adminAuth.js";
import verifyBook from "../../../../middleware/verifyBook.js";
import Offer, { OfferInterface } from "../../../../../models/offer.js";

const addOfferResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const adminAuth: adminAuth = context.adminAuth;

		if (adminAuth?.error) throw new Error(adminAuth?.error);

		const { percent, bookId, expireAt } = args;

		if (!percent && !bookId && !expireAt)
			throw new Error(
				lang == "ar"
					? "من فضلك ادخل بيانات العرض"
					: "please, enter the offer data",
			);

		if (!percent)
			throw new Error(
				lang == "ar" ? "من فضلك ادخل النسبة" : "please enter the percent",
			);

		if (percent < 1 || percent > 100) {
			throw new Error(
				lang == "ar" ? "هذه النسبة غير صالحة" : "invalid percent",
			);
		}

		const bookVerification = await verifyBook(bookId, context);

		if (bookVerification?.error) throw new Error(bookVerification?.error);

		if (!expireAt)
			throw new Error(
				lang == "ar"
					? "من فضلك ادخل تاريخ الانتهاء"
					: "please enter the expire date",
			);

		const expireAtDate = new Date(
			String(parseInt(expireAt)) === expireAt ? parseInt(expireAt) : expireAt,
		);

		if (isNaN(expireAtDate.getDate()))
			throw new Error(
				lang == "ar" ? "تاريخ انتهاء العرض غير صالح" : "invalid expire date",
			);

		if (expireAtDate.getTime() - Date.now() < 1000 * 60 * 60)
			throw new Error(
				lang == "ar"
					? "اسف هذا العرض سوف ينتهى فى اقل من ربع ساعة"
					: "Sorry, this offer will expire in less than one hour",
			);

		const oldOffer = await Offer.findOne({ book: bookId });

		if (oldOffer) {
			const updatedOffer: OfferInterface = await Offer.findByIdAndUpdate(
				{ _id: oldOffer._id },
				{
					percent,
					expireAt: expireAtDate,
				},
				{ new: true },
			);

			updatedOffer.book = bookVerification.bookData;

			return updatedOffer;
		} else {
			const offer: OfferInterface = await Offer.create({
				percent,
				book: bookId,
				expireAt: expireAtDate,
			});

			offer.book = bookVerification.bookData;

			return offer;
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default addOfferResolve;
