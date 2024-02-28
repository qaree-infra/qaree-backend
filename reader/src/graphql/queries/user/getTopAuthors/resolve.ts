import User, { UserInterface } from "../../../../models/user.js";

const resolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const page = args.page || 1;
		const limit = args.limit || 10;

		const startIndex = (Number(page) - 1) * limit;

		const total = await User.countDocuments({
			bookReads: { $gt: [] },
			books: { $gt: [] },
			valid: true,
		});

		const authors = await User.find({
			bookReads: { $gt: [] },
			books: { $gt: [] },
			valid: true,
		})
			.select("-password")
			.sort({ bookReads: 1, books: 1, followers: 1, updatedAt: -1 })
			.limit(limit)
			.skip(startIndex)
      .populate("avatar");

		return {
			authors,
			total,
			currentPage: page,
			numberOfPages: Math.ceil(total / limit),
		};
	} catch (error) {
		throw new Error(error?.message || error);
	}
};

export default resolve;
