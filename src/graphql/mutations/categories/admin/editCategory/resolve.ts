import mongoose from "mongoose";
import { adminAuth } from "../../../../../middleware/adminAuth.js";
import Category, { CategoryInterface } from "../../../../../models/category.js";

const editCategoryResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const adminAuth: adminAuth = context.adminAuth;

		if (adminAuth?.error) throw new Error(adminAuth?.error);

		const { name_ar, name_en, categoryId } = args;

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

		if (!name_ar && !name_en)
			throw new Error(lang === "ar" ? "تصنيف غير صالح" : "Invalid category");

		const arabicRegex = /[\u0600-\u06FF]/;

		if (!arabicRegex.test(name_ar))
			throw new Error(
				lang === "ar"
					? "اسم التصنيف بالعربية غير صالح"
					: "Invalid category arabic name",
			);

		const updatedCateogory: CategoryInterface =
			await Category.findByIdAndUpdate(
				category._id,
				{
					name_ar,
					name_en,
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
