import { BookInterface } from "../../../../models/book.js";
// import verifyBook from "../../../middleware/verifyBook.js";
import verifyBook from "../../../../middleware/general/verifyBook.js";

interface ArgsInterface {
	bookId: string;
}

interface VerifyBookInterface {
	error?: string;
	bookData: BookInterface;
}

const getBookInfoResolve = async (_, args: ArgsInterface, context) => {
	try {
		const { bookId } = args;
		const auth = context.auth;

		if (auth.error) throw new Error(auth.error);

		const { error, bookData }: VerifyBookInterface = await verifyBook(
			context,
			bookId,
			auth.user._id,
		);

		if (error) {
			throw new Error(error);
		}

		return bookData;
	} catch (error) {
		console.log(error);
		throw new Error(error.message);
	}
};

export default getBookInfoResolve;
