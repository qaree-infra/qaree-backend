import Room, { RoomInterface } from "../models/chatRoom.js";

export default (io, socket) => {
	return async ({ room, limitMembers, page }) => {
		const userData = socket.handshake["authData"].user;

		const orOptions =
			room.split("-").length !== 2
				? [
						{
							roomId: room,
							$or: [
								{ creator: userData._id },
								{ members: { $in: [userData._id] } },
							],
						},
						{
							_id: room,
							$or: [
								{ creator: userData._id },
								{ members: { $in: [userData._id] } },
							],
						},
						{
							book: room,
							members: { $in: [userData._id] },
						},
				  ]
				: [
						{
							roomId: room,
							creator: userData._id,
							partner:
								room.split("-")[1] !== userData._id.toString()
									? room.split("-")[1]
									: room.split("-")[0],
						},
				  ];

		const roomData: RoomInterface = await Room.findOne({
			$or: orOptions,
		});

		if (roomData) {
			const currentPage = Number(page || 1);
			const startIndex =
				(Number(currentPage) - 1) * (Number(limitMembers) || 10);
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
