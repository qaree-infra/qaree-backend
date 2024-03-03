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
		]);

		const books = await query.exec();

		return { books };
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default resolve;
