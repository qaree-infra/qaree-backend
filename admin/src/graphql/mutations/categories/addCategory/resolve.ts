import { auth } from "../../../../middleware/general/auth.js";
import Category, { CategoryInterface } from "../../../../models/category.js";
import validateCategory from "../../../middleware/validateCategory.js";

const addCategroyResolve = async (_, args, context) => {
	try {
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { name_ar, name_en, background } = args;

		const validateArgs: { error: string; valid: boolean } =
			await validateCategory(args, context, "add");

		if (!validateArgs.valid) throw new Error(validateArgs.error);

		const newCategory: CategoryInterface = await Category.create({
			name_ar,
			name_en,
			background 
		});

		return newCategory;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default addCategroyResolve;
