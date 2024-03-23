import { auth } from "../../../../../middleware/general/auth.js";
import BookRead from "../../../../../models/bookRead.js";
import verifyBook from "../../../../middleware/verifyBook.js";

const resolve = async (_, { bookId }, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;

		if (auth.error) throw new Error(auth.error);

		const bookVerification = await verifyBook(bookId, context);
		if (bookVerification.error) throw new Error(bookVerification.error);

		const bookRead = await BookRead.findOne({
			user: auth.user._id,
			book: bookId,
		});

		return bookRead;
	} catch (error) {
		throw new Error(error);
	}
};

export default resolve;
