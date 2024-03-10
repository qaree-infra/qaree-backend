import { auth } from "../../../../middleware/general/auth.js";
import Shelf, { ShelfInterface } from "../../../../models/shelf.js";

interface Args {
	name: string;
}

interface ShelfData extends ShelfInterface {
	name?: string;
}

const resolve = async (_, args: Args, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { name } = args;

		if (!name) {
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل اسم الرف"
					: "please, enter the shelf name",
			);
		}

		const createdShelf: ShelfInterface = await Shelf.findOne({
			$or: [
				{
					name_en: name,
				},
				{
					name_ar: name,
				},
			],
			userId: auth.user._id,
		});

		if (createdShelf !== null) {
			throw new Error(
				lang === "ar"
					? "نأسف هذا الرف موجود مسبقاً"
					: "Sorry, this shelf has been created.",
			);
		}

		const newShelf: ShelfData = await Shelf.create({
			name_ar: name,
			name_en: name,
			userId: auth.user._id,
		});

		newShelf.name = lang === "ar" ? newShelf.name_ar : newShelf.name_en;

		return {
			shelf: newShelf,
			success: true,
			message:
				lang === "ar"
					? "تم انشاء الرف بنجاح"
					: "The shelf has been created successfully",
		};
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
};

export default resolve;
