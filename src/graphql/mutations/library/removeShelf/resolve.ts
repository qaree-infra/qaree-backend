import mongoose from "mongoose";
import { auth } from "../../../../middleware/auth.js";
import Shelf, { ShelfInterface } from "../../../../models/shelf.js";

const removeShelfResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;

		if (auth.error) throw new Error(auth.error);

		const { shelf } = args;

		if (!shelf) {
			throw new Error(
				lang === "ar" ? "من فضلك ادخل الرف" : "please, enter the shelf",
			);
		}

		const orOptions = mongoose.Types.ObjectId.isValid(shelf)
			? [{ _id: shelf }]
			: [{ name: shelf }];

		const shelfData: ShelfInterface = await Shelf.findOne({
			$or: orOptions,
			userId: auth.user._id,
		});

		if (!shelfData)
			throw new Error(lang === "ar" ? "هذا الرف غير موجود" : "not found shelf");

		await Shelf.findByIdAndDelete(shelfData._id);

		return {
			success: true,
			message:
				lang === "ar"
					? "تم حذف الرف بنجاج"
					: "the shelf have been deleted successfully",
		};
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default removeShelfResolve;
