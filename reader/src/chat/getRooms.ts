import Room from "../models/chatRoom.js";

export default (io, socket) => {
	return async ({ page, limit, keyword = "" }) => {
		const userData = socket.handshake["authData"].user;

		const startIndex = (Number(page || 1) - 1) * limit;
		const keys = keyword
			?.trim()
			?.split(" ")
			.map((e: string) => new RegExp(e, "gi"));

		const orOptions = [
			{
				$or: [{ name: { $in: keys } }],
				creator: userData._id,
				activation: true,
			},
			{
				$or: [{ name: { $in: keys } }],
				members: { $elemMatch: { user: userData._id } },
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
					options: {
						populate: { path: "avatar" },
					},
				},
				{
					path: "avatar",
				},
			]);

		const totalRooms = await Room.countDocuments({ $or: orOptions });

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
