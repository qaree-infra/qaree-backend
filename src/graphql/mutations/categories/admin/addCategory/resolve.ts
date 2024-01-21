import { adminAuth } from "../../../../../middleware/adminAuth.js";
import Category, { CategoryInterface } from "../../../../../models/category.js";
// import validateCategoryName from "../../../../middleware/validateCategory.js";

const addCategroyResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const adminAuth: adminAuth = context.adminAuth;

		if (adminAuth?.error) throw new Error(adminAuth?.error);

		const { name_ar, name_en } = args;

		// const validateArgs: { error: string; valid: boolean } =
		// 	await validateCategoryName(args, context, "add");

		// if (!validateArgs.valid) throw new Error(validateArgs.error);

		if (!name_ar || !name_en)
			throw new Error(lang === "ar" ? "تصنيف غير صالح" : "Invalid category");

		if (!name_en)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل اسم التصنيف بالانجليزية"
					: "please, enter name in english",
			);

		if (!name_ar)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل اسم التصنيف بالعربية"
					: "please, enter name in arabic",
			);

		const arabicRegex = /[\u0600-\u06FF]/;

		if (!arabicRegex.test(name_ar))
			throw new Error(
				lang === "ar"
					? "اسم التصنيف بالعربية غير صالح"
					: "Invalid category arabic name",
			);

		const newCategory: CategoryInterface = await Category.create({
			name_ar,
			name_en,
		});

		return newCategory;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default addCategroyResolve;
