import mongoose from "mongoose";
import Offer from "../../../../../models/offer.js";

const getOfferResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;
		const { id } = args;

		console.log(lang);

		if (!id)
			throw new Error(
				lang == "ar"
					? "من فضلك ادخل معرف الكتاب او العرض"
					: "please enter book id or offer id",
			);

		if (!mongoose.isObjectIdOrHexString(id))
			throw new Error(lang == "ar" ? "هذا المعرف غير صالح" : "invalid id");

		const offer = await Offer.findOne({
			$or: [{ _id: id }, { book: id }],
		}).populate({
			path: "book",
			options: { populate: ["author", "cover", "sample"] },
		});

		if (!offer)
			throw new Error(
				lang == "ar"
					? "عفواً هذا العرض غير موجود"
					: "Sorry, this offer is non found",
			);

		return offer;
	} catch (error) {
		throw new Error(error);
	}
};

export default getOfferResolve;
