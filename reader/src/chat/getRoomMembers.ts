import Room, { RoomInterface } from "../models/chatRoom.js";

export default (io, socket) => {
	return async ({ room, limitMembers, page }) => {
		const userData = socket.handshake["authData"].user;

		const orOptions = [
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
		];

		const roomData: RoomInterface = await Room.findOne({
			$or: orOptions,
		});

		if (roomData) {
			const startIndex = (Number(page) - 1) * (Number(limitMembers) || 10);
			const currentPage = page;
			const roomMembers = await Room.findById(roomData._id).populate([
				{
					path: "members",
					options: {
						select: "-password",
						populate: { path: "avatar" },
						limit: Number(limitMembers) || 10,
						skip: startIndex,
					},
				},
			]);

			socket.emit("get-room-members", {
				members: roomMembers.members,
				currentPage,
				numberOfPages: Math.ceil(
					roomData.members.length / (Number(limitMembers) || 10),
				),
				totalMembers: roomData.members.length,
			});
		} else {
			socket.emit("error", "This is room not found");
		}
	};
};
