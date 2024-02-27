import mongoose from "mongoose";
import Category, { CategoryInterface } from "../../../../../models/category.js";
import { auth } from "../../../../../middleware/general/auth.js";

const deleteCategory = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { categoryId } = args;

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

		await Category.deleteOne({ _id: category._id });

		return {
			message: "Category deleted successfully",
			success: true,
		};
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default deleteCategory;
