import Category, {CategoryInterface} from "../../../../../models/category.js";
import { auth } from "../../../../../middleware/general/auth.js";

const getAllResolve = async (_, args, context) => {
	try {
		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { completed } = args;
		const page = args?.page || 1;
		const limit = args?.limit || 10;
		const startIndex = (Number(page) - 1) * limit;

		const totalCategories = await Category.countDocuments();
		const totalCompletedCategories = await Category.countDocuments({
			icon: { $ne: null },
		});
		const totalUncompletedCategories = await Category.countDocuments({
			icon: { $eq: null },
		});

		if (completed) {
			const categories: Array<CategoryInterface> = await Category.find({
				icon: { $ne: null },
			})
				.limit(limit)
				.skip(startIndex)
				.populate("icon");
        
        return {
          categories,
          currentPage: page
					? Number(page)
					: totalCompletedCategories === 0
					? 0
					: 1,
          numberOfPages: Math.ceil(totalCompletedCategories / limit),
          totalCompleted: totalCompletedCategories,
          totalUncompleted: totalUncompletedCategories,
          total: totalCategories,
        };
      } else {
        const categories: Array<CategoryInterface> = await Category.find({
          icon: { $eq: null },
        })
				.limit(limit)
				.skip(startIndex)
        .populate("icon");

			return {
				categories,
				currentPage: page
					? Number(page)
					: totalUncompletedCategories === 0
					? 0
					: 1,
				numberOfPages: Math.ceil(totalUncompletedCategories / limit),
				totalUncompleted: totalUncompletedCategories,
				totalCompleted: totalCompletedCategories,
				total: totalCategories,
			};
		}
	} catch (error) {
		throw new Error(error);
	}
};

export default getAllResolve;
