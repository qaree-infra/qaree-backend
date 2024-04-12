import Room from "../models/chatRoom.js";

export default (io, socket) => {
	return async ({ room }) => {
		const userData = socket.handshake["authData"].user;

		const roomData = await Room.findOne({
			$or: [
				{
					_id: room,
					activation: true,
				},
				{
					roomId: room,
					activation: true,
				},
				{
					book: room,
					activation: true,
				},
				{
					creator: userData._id,
					partner: room.split("-")[1],
					activation: true,
				},
			],
		}).populate([
			{
				path: "partner",
				options: {
					select: "name avatar",
					populate: { path: "avatar" },
				},
			},
			{
				path: "book",
				options: {
					select: "name cover",
					populate: { path: "cover" },
				},
			},
		]);

		if (roomData) {
			socket.emit("get-room", roomData);
		} else {
			socket.emit("error", "This is room not found");
		}
	};
};
