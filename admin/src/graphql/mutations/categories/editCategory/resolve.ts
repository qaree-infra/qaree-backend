import mongoose from "mongoose";
import { auth } from "../../../../middleware/general/auth.js";
import Category, { CategoryInterface } from "../../../../models/category.js";
import validateCategoryName from "../../../middleware/validateCategory.js";

const editCategoryResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { name_ar, name_en, background, categoryId } = args;

		if (!categoryId)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل معرف التصنيف"
					: "please, enter the category id",
			);

		if (!mongoose.isObjectIdOrHexString(categoryId))
			throw new Error(
				lang === "ar" ? "معرف التصنيف غير صالح" : "Invalid category id",
			);

		const category: CategoryInterface = await Category.findById(categoryId);

		if (!category)
			throw new Error(
				lang === "ar" ? "هذا التصنيف غير موجود" : "This category is nonfound",
			);

		const validateArgs: { error: string; valid: boolean } =
			await validateCategoryName(args, context, "update");

		if (!validateArgs.valid) throw new Error(validateArgs.error);

		const updatedCateogory: CategoryInterface =
			await Category.findByIdAndUpdate(
				category._id,
				{
					name_ar,
					name_en,
					background
				},
				{ new: true },
			);

		return updatedCateogory;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default editCategoryResolve;
