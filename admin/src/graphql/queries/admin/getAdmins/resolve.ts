import { auth } from "../../../../middleware/general/auth.js";
import Admin, { AdminInterface } from "../../../../models/admin.js";

const sortByValues = { updatedAt: -1, name: 1, createdAt: -1 };

const resolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

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

		const total = await Admin.countDocuments();

		const admins: Array<AdminInterface> = await Admin.find({
			$or: [{ name: { $in: keys } }, { email: { $in: keys } }],
		})
			.select("-password")
			.sort(sortFields)
			.limit(limit)
			.skip(startIndex)
			.populate("avatar");

		return {
			admins,
			total,
			currentPage: page,
			numberOfPages: Math.ceil(total / limit),
		};
	} catch (error) {
		throw new Error(error);
	}
};

export default resolve;
