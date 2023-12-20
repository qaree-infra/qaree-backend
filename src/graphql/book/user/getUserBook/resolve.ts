import verifyBookAuthor from "../../../middleware/verifyBookAuthor.js";
import { auth } from "../../../../middleware/auth.js";

const getUserBookResolve = async (_, args, context) => {
  try {
    const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

    const { bookId } = args;

    const verifyBook = await verifyBookAuthor(
      context,
      bookId,
      auth.user?._id,
    );

    if (verifyBook?.error) throw new Error(verifyBook?.error);

    return verifyBook.bookData;
  } catch (error) {
    throw new Error(error);
  }
}

export default getUserBookResolve;
