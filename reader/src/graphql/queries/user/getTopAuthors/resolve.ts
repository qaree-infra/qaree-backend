import BookRead from "../../../../models/bookRead.js";

const resolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const page = args.page || 1;
		const limit = 25;

		const startIndex = (Number(page) - 1) * limit;

		const authors = await BookRead.aggregate([
			{
				$lookup: {
					from: "books",
					localField: "book",
					foreignField: "_id",
					as: "book",
				},
			},
			{
				$unwind: "$book",
			},
			{
				$match: {
					"book.status": "published",
				},
			},
			{
				$group: {
					_id: "$book.author",
					totalReads: { $sum: 1 },
				},
			},
			// {
			// 	$group: {
			// 		_id: null,
			// 		count: { $sum: 1 }, // count the number of authors with 1 book read
			// 	},
			// },
			{
				$sort: {
					totalReads: -1,
				},
			},
			{
				$limit: 25,
			},
			{
				$lookup: {
					from: "users",
					localField: "_id",
					foreignField: "_id",
					as: "author",
				},
			},
			{
				$unwind: "$author",
			},
			{ $skip: startIndex },
			{
				$lookup: {
					from: "files",
					localField: "author.avatar",
					foreignField: "_id",
					as: "author.avatar",
				},
			},
			{
				$unwind: "$author.avatar",
			},
			{
				$project: {
					author: {
						_id: 1,
						name: 1,
						avatar: 1,
						bio: 1,
					},
				},
			},
		]);

		console.log(authors);

		const authorCount = await BookRead.distinct("book").distinct("author");
		console.log(authorCount);

		const total =
			authors.length > 0 && authors[0].totalAuthors !== undefined
				? authors[0].totalAuthors
				: authors.length;

		return {
			authors:
				authors.length > 0 ? authors.map((author) => author.author) : authors,
			total: total,
			currentPage: page,
			numberOfPages: Math.ceil(total / limit),
		};
	} catch (error) {
		console.log(error);
		throw new Error(error?.message || error);
	}
};

export default resolve;
