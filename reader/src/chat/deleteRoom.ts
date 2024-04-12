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
			],
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

			socket.emit("get-room", roomData);
		} else {
			socket.emit("error", "This is room not found");
		}
	};
};
