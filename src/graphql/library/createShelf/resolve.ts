import { auth } from "../../../middleware/auth.js";
import Shelf, { ShelfInterface } from "../../../models/shelf.js";

interface Args {
	name: string;
}

const resolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { name } = args;

		const createdShelf: ShelfInterface = await Shelf.findOne({
			name,
			userId: auth.user._id,
		});

		if (createdShelf !== null) {
			throw new Error(
				lang === "ar"
					? "نأسف هذا الرف موجود مسبقاً"
					: "Sorry, this shelf has been created.",
			);
		}

		const newShelf: ShelfInterface = await Shelf.create({
			name: name,
			userId: auth.user._id,
		});

    return newShelf;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
};

export default resolve;
