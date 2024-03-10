import mongoose from "mongoose";
import { auth } from "../../../../middleware/general/auth.js";
import Shelf, { ShelfInterface } from "../../../../models/shelf.js";
import { MAIN_SHELFS_READING } from "../../../../utils/consts.js";

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

		const idValidation = mongoose.isObjectIdOrHexString(shelf);

		const orOptions = idValidation
			? [{ _id: shelf }]
			: [{ name_ar: shelf }, { name_en: shelf }];

		const shelfData: ShelfInterface = await Shelf.findOne({
			$or: orOptions,
			userId: auth.user._id,
		});

		if (!shelfData)
			throw new Error(lang === "ar" ? "هذا الرف غير موجود" : "not found shelf");
		else {
			if (
				MAIN_SHELFS_READING.filter(
					(s) => s === shelfData.name_ar || s === shelfData.name_en,
				).length
			)
				throw new Error(
					lang === "ar"
						? "غير مسموح بحذف هذا الرف"
						: "Removing this shelf is not allowed",
				);
		}
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
