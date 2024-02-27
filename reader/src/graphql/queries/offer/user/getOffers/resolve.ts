import Offer from "../../../../../models/offer.js";

const sortByValues = { createdAt: -1, expireAt: -1, percent: 1 };

const getOffersResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const page = args?.page || 1;
		const limit = args?.limit || 10;
		const sort = args?.sort || "percent";

		if (sort && !sortByValues[sort]) {
			throw new Error(
				lang === "ar"
					? "نأسف لا نستطيع ان نرتب بيانات الكتب حسب هذه القيمة"
					: "invalid sort by value",
			);
		}

		const sortFields = {};

		if (sort) {
			sortFields[sort] = sortByValues[sort];
		}

		const startIndex = (Number(page) - 1) * limit;

		const totalOffers = await Offer.countDocuments();

		const offers = await Offer.find()
			.sort(sortFields)
			.limit(limit || 10)
			.skip(startIndex)
			.populate({
				path: "book",
				options: { populate: ["author", "cover", "sample"] },
			});

		return {
			offers,
			total: totalOffers,
			currentPage: page ? Number(page) : totalOffers === 0 ? 0 : 1,
			numberOfPages: Math.ceil(totalOffers / (limit || 10)),
		};
	} catch (error) {
		throw new Error(error);
	}
};

export default getOffersResolve;
