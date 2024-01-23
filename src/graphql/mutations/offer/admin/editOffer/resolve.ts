import mongoose from "mongoose";
import { adminAuth } from "../../../../../middleware/adminAuth.js";
import Offer, { OfferInterface } from "../../../../../models/offer.js";

const editOffer = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const adminAuth: adminAuth = context.adminAuth;

		if (adminAuth?.error) throw new Error(adminAuth?.error);

		const { percent, expireAt, id } = args;

		if (!percent && !expireAt)
			throw new Error(
				lang == "ar"
					? "من فضلك ادخل بيانات العرض"
					: "please, enter the offer data",
			);

		const updateData: { percent?: number; expireAt?: Date } = {};

		if (percent) {
			if (percent < 1 || percent > 100) {
				throw new Error(
					lang == "ar" ? "هذه النسبة غير صالحة" : "invalid percent",
				);
			}

			updateData.percent = percent;
		}

		if (expireAt) {
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

			updateData.expireAt = expireAtDate;
		}

		if (!id)
			throw new Error(
				lang == "ar"
					? "من فضلك ادخل معرف الكتاب او العرض"
					: "please enter book id or offer id",
			);

		if (!mongoose.isObjectIdOrHexString(id))
			throw new Error(lang == "ar" ? "هذا المعرف غير صالح" : "invalid id");

		const offer: OfferInterface = await Offer.findOne({
			$or: [{ _id: id }, { book: id }],
		});

		if (!offer)
			throw new Error(
				lang == "ar"
					? "عفواً هذا العرض غير موجود"
					: "Sorry, this offer is non found",
			);

		const updatedOffer: OfferInterface = await Offer.findByIdAndUpdate(
			offer._id,
			updateData,
			{ new: true },
		).populate({
			path: "book",
			options: { populate: ["author", "cover", "sample"] },
		});

		return updatedOffer;
	} catch (error) {
		throw new Error(error);
	}
};

export default editOffer;
