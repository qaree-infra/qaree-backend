import Room from "../models/chatRoom.js";

export default (io, socket) => {
	return async ({ page, limit, keyword = "" }) => {
		const userData = socket.handshake["authData"].user;

		const startIndex = (Number(page || 1) - 1) * limit;
		const keys = keyword
			?.trim()
			?.split(" ")
			.map((e: string) => new RegExp(e, "gi"));

		console.log(keys);

		const orOptions = [
			{
				// $or: [{ name: { $in: keys } }],
				creator: userData._id,
				activation: true,
			},
			{
				// $or: [{ name: { $in: keys } }],
				// members: { $elemMatch: { user: userData._id } },
				members: { $in: [userData._id] },
				activation: true,
			},
		];

		const roomData = await Room.find({
			$or: orOptions,
		})
			.limit(limit || 10)
			.skip(startIndex)
			.sort({ updatedAt: -1 })
			.populate([
				{
					path: "partner",
					match: { name: { $in: keys } },
					options: {
						select: "name avatar",
						populate: { path: "avatar" },
					},
				},
				{
					path: "book",
					match: { name: { $in: keys } },
					options: {
						select: "name cover",
						populate: { path: "cover" },
					},
				},
			]);

		console.log(roomData);

		const totalRooms = await Room.countDocuments({
			$or: [
				{
					$and: [
						{ partner: { $exists: true } },
						{
							$lookup: {
								from: "User", // Assuming your user collection name is 'User'
								localField: "partner",
								foreignField: "_id",
								as: "partnerDetails",
							},
						},
						{
							$match: {
								"partnerDetails.name": { $in: keys }, // Case-insensitive search by name
							},
						},
					],
				},
				{
					$and: [
						{ book: { $exists: true } },
						{
							$lookup: {
								from: "Book", // Assuming your user collection name is 'User'
								localField: "book",
								foreignField: "_id",
								as: "bookDetails",
							},
						},
						{
							$match: {
								"bookDetails.name": { $in: keys }, // Case-insensitive search by name
							},
						},
					],
				},
			],
		});

		if (roomData) {
			socket.emit("get-rooms", {
				rooms: roomData,
				totalRooms,
				currentPage: Number(page || 1),
				numberOfPages: Math.ceil(totalRooms / (limit || 10)),
			});
		} else {
			socket.emit("error", "This is room not found");
		}
	};
};
