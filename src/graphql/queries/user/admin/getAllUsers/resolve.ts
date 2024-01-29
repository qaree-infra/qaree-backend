import { adminAuth } from "../../../../../middleware/adminAuth.js";
import User from "../../../../../models/user.js";

const sortByValues = { updatedAt: -1, name: 1, createdAt: -1 };

const resolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const adminAuth: adminAuth = context.adminAuth;

		if (adminAuth?.error) throw new Error(adminAuth?.error);

		const { sortBy } = args;
		const page = args?.page || 1;
		const limit = args?.limit || 10;
		const keyword = args?.keyword || "";

		if (sortBy && !sortByValues[sortBy]) {
			throw new Error(
				lang === "ar"
					? "نأسف لا نستطيع ان نرتب بيانات الكتب حسب هذه القيمة"
					: "invalid sort by value",
			);
		}

		const sortFields = {};

		if (sortBy) {
			if (sortBy === "updatedAt") sortFields[sortBy] = -1;
			else sortFields[sortBy] = 1;
		}

		const startIndex = (Number(page) - 1) * limit;
		const keys = keyword
			?.trim()
			?.split(" ")
			.map((e: string) => new RegExp(e, "gi"));

		const total = await User.countDocuments({
			$or: [{ name: { $in: keys } }, { email: { $in: keys } }],
		});

		const users = await User.find({
			$or: [{ name: { $in: keys } }, { email: { $in: keys } }],
		})
			.select("-password")
			.sort(sortFields)
			.limit(limit)
			.skip(startIndex)
			.populate("avatar");

		return {
			users,
			total,
			currentPage: page,
			numberOfPages: Math.ceil(total / limit),
		};
	} catch (error) {
		throw new Error(error);
	}
};

export default resolve;
