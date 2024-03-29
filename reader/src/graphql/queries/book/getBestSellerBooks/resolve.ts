import Book from "../../../../models/book.js";

const resolve = async (_, args, context) => {
	try {
		const limit = args?.limit || 10;

		const query = Book.aggregate([
			{
				$match: {
					status: "published",
				},
			},
			{
				$addFields: {
					bookReadsSize: {
						$cond: {
							if: { $isArray: "$bookReads.purchased" },
							then: { $size: "$bookReads.purchased" },
							else: 0,
						},
					},
				},
			},
			{
				$sort: {
					bookReadsSize: 1,
					avgRate: -1,
				},
			},
			{
				$project: {
					bookReadsSize: 1,
					_id: 1,
					name: 1,
					description: 1,
					isbn: 1,
					edition: 1,
					publishingRights: 1,
					categories: 1,
					avgRate: 1,
					price: 1,
					cover: 1,
					sample: 1,
					language: 1,
					author: 1,
					createdAt: 1,
					updatedAt: 1,
					publishionDate: 1,
					previousPublishingData: 1,
				},
			},
			{
				$limit: limit,
			},
			{
				$unwind: "$author",
			},
			{
				$lookup: {
					from: "users",
					localField: "author",
					foreignField: "_id",
					as: "author",
				},
			},
			{
				$unwind: "$cover",
			},
			{
				$lookup: {
					from: "files",
					localField: "cover",
					foreignField: "_id",
					as: "cover",
				},
			},
			{
				$unwind: "$categories",
			},
			{
				$lookup: {
					from: "categories",
					localField: "categories",
					foreignField: "_id",
					as: "categories",
				},
			},
		]);

		const books = await query.exec();

		return {
			books: books.map((b) => ({
				...b,
				author: b.author[0],
				cover: b.cover[0],
			})),
		};
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default resolve;
