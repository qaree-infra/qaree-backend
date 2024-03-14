import { auth } from "../../../../../middleware/general/auth.js";
import BookRead, { BookReadInterface } from "../../../../../models/bookRead.js";

const getBookActivitesResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;

		if (auth.error) throw new Error(auth.error);

		const bookReads: Array<BookReadInterface> = await BookRead.find({
			user: auth.user._id,
		})
			.populate({
				path: "book",
				options: { populate: ["cover", "author", "categories"] },
			})
			.sort({ updatedAt: -1 })
			.limit(1);

		return bookReads[0];
	} catch (error) {
		throw new Error(error);
	}
};

export default getBookActivitesResolve;
