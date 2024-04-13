import mongoose from "mongoose";
import Room from "../models/chatRoom.js";

export default (io, socket) => {
	return async function isTypeing({ room, isTypeing }) {
		const userData = socket.handshake["authData"].user;
		if (isTypeing !== false && isTypeing !== true) {
			// console.log("invalid typeing");
			return socket.emit("error", "invalid is typeing");
		}

		if (!room || room.trim().length === 0)
			return socket.emit("error", "Invalid room ID format");

		if (room.split("-").length !== 2) {
			if (!mongoose.isObjectIdOrHexString(room))
				return socket.emit("error", "Invalid room ID format");
		}

		// console.log(room, isTypeing);
		const orOptions =
			room.split("-").length !== 2
				? [
						{
							roomId: room,
							$or: [
								{ creator: userData._id },
								{ members: { $in: [userData._id] } },
							],
							activation: true,
						},
						{
							_id: room,
							$or: [
								{ creator: userData._id },
								{ members: { $in: [userData._id] } },
							],
							activation: true,
						},
						{
							book: room,
							members: { $in: [userData._id] },
							activation: true,
						},
				  ]
				: [
						{
							roomId: room,
							creator: userData._id,
							partner: room.split("-")[1],
							activation: true,
						},
				  ];

		const roomData = await Room.findOne({
			$or: orOptions,
		});
		// console.log(roomData);

		if (
			roomData?.members.length > 0 &&
			!roomData?.members?.includes(userData._id)
		) {
			return socket.emit("error", "invalid room");
		}

		if (roomData) {
			io.in(roomData.roomId).emit("typeing", {
				user: {
					_id: userData._id,
					name: userData.name,
					avatar: userData.avatar,
					bio: userData.bio,
				},
				room: room,
				roomData: roomData,
				isTypeing: isTypeing,
			});
		} else return socket.emit("error", "invalid room");
	};
};
