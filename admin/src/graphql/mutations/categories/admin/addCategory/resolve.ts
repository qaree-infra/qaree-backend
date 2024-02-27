import { auth } from "../../../../../middleware/general/auth.js";
import Category, { CategoryInterface } from "../../../../../models/category.js";
import validateCategoryName from "../../../../middleware/validateCategory.js";

const addCategroyResolve = async (_, args, context) => {
	try {
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { name_ar, name_en } = args;

		const validateArgs: { error: string; valid: boolean } =
			await validateCategoryName(args, context, "add");

		if (!validateArgs.valid) throw new Error(validateArgs.error);

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
