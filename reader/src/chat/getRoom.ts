import Room from "../models/chatRoom.js";

export default (io, socket) => {
	return async ({ room }) => {
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

		const roomData = await Room.findOne({
			$or: orOptions,
		}).populate([
			{
				path: "partner",
				options: {
					select: "name bio avatar",
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
			{
				path: "members",
				options: {
					select: "-password",
					populate: { path: "avatar" },
					limit: 10,
					skip: 0,
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
