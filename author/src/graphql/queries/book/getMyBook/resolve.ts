import verifyBook from "../../../../middleware/general/verifyBook.js";
import { auth } from "../../../../middleware/general/auth.js";

const getMyBookResolve = async (_, args, context) => {
	try {
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { bookId } = args;

		const bookVerification = await verifyBook(context, bookId, auth.user?._id);

		if (bookVerification?.error) throw new Error(bookVerification?.error);

		return bookVerification.bookData;
	} catch (error) {
		throw new Error(error);
	}
};

export default getMyBookResolve;
