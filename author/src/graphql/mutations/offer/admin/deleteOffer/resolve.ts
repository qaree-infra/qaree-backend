import mongoose from "mongoose";

import { adminAuth } from "../../../../../middleware/general/adminAuth.js";

import Offer, { OfferInterface } from "../../../../../models/offer.js";

const deleteOfferResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const adminAuth: adminAuth = context.adminAuth;

		if (adminAuth?.error) throw new Error(adminAuth?.error);

		const { id } = args;

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

		await Offer.deleteOne({ _id: offer._id });

		return {
			message: "Offer have been deleted successfully",
			success: true,
		};
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default deleteOfferResolve;
