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
		});

		if (roomData) {
			if (roomData.members.length > 0) {
				await Room.findByIdAndUpdate(roomData._id, {
					members: roomData.members.filter((m) => m !== userData._id),
				});
			} else {
				await Room.findByIdAndUpdate(
					roomData._id,
					{ activation: false },
					{ new: true },
				);
			}

			socket.emit("delete-chat", {
				success: true,
				message: "the chat have been deleted successfully",
			});
		} else {
			socket.emit("error", "This is room not found");
		}
	};
};
