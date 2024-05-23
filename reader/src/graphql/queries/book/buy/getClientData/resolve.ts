import { auth } from "../../../../../middleware/general/auth.js";
import dotenv from "dotenv";
import { generateClientToken } from "../../../../../utils/paypal/paypal-api.js";
import verifyBook from "../../../../../middleware/general/verifyBook.js";

dotenv.config();

const resolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const { bookId } = args;

		const bookVerification = await verifyBook(bookId, context);

		const auth: auth = context.auth;
		if (auth?.error) throw new Error(auth?.error);

		const clientId = process.env.PAYPAL_CLIENT_ID;
		const clientToken = await generateClientToken(
			bookVerification.bookData.author.merchantId,
		);

		return { clientId, clientToken };
	} catch (error) {
		throw new Error(error?.message || error);
	}
};

export default resolve;
