import Category, { CategoryInterface } from "../../../../models/category.js";

const getAllCategoriesResolve = async (_, args, context) => {
	try {
		const page = args?.page || 1;
		const limit = args?.limit || 10;
		const startIndex = (Number(page) - 1) * limit;

		const totalCategories = await Category.countDocuments({
			icon: { $ne: null },
		});

		const categories: Array<CategoryInterface> = await Category.find({
			icon: { $ne: null },
		})
			.limit(limit)
			.skip(startIndex)
			.populate("icon");

		return {
			categories,
			currentPage: page ? Number(page) : totalCategories === 0 ? 0 : 1,
			numberOfPages: Math.ceil(totalCategories / limit),
			total: totalCategories,
		};
	} catch (error) {
		throw new Error(error);
	}
};

export default getAllCategoriesResolve;
