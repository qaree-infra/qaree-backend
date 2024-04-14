import User from "../models/user.js";
import Message from "../models/message.js";
import Room from "../models/chatRoom.js";

export default (io, socket) => {
	return async ({ content, to }) => {
		const userData = socket.handshake["authData"].user;

		// console.log(content, to);
		if (content.length === 0) return socket.emit("error", "Empty content");
		if (content.length > 500)
			return socket.emit(
				"error",
				"Message content length must be less than 500 char",
			);
		if (!to || to.trim().length === 0)
			return socket.emit("error", "Invalid recipient ID format");
		const toId =
			to.split("-")[1] !== userData._id.toString()
				? to.split("-")[1]
				: to.split("-")[0] || "";

		const orOptions =
			to.split("-").length !== 2
				? [
						{
							roomId: to,
							$or: [
								{ creator: userData._id },
								{ members: { $in: [userData._id] } },
							],
							activation: true,
						},
						{
							_id: to,
							$or: [
								{ creator: userData._id },
								{ members: { $in: [userData._id] } },
							],
							activation: true,
						},
						{
							book: to,
							members: { $in: [userData._id] },
							activation: true,
						},
				  ]
				: [
						{
							creator: userData._id,
							partner: toId,
							activation: true,
						},
				  ];

		const roomData = await Room.findOne({
			$or: orOptions,
		});

		if (
			roomData?.members.length > 0 &&
			!roomData?.members?.includes(userData._id)
		) {
			return socket.emit("error", "invalid room");
		}

		if (!roomData) {
			if (to.includes("user")) {
				const reciverId = toId === userData._id;
				if (reciverId)
					return socket.emit("error", "sorry, you can't send message to you");
				const reciver = await User.findById(toId);
				if (!reciver) return socket.emit("error", "invalid reciver");
				else {
					const newTo = `${userData._id}-${toId}`;
					await socket.join(newTo);
					// console.log(newTo);
					const message = await Message.create({
						content: content,
						sender: userData._id,
						room: newTo,
					});
					await Room.insertMany([
						{
							creator: userData._id,
							roomId: userData._id + "-" + reciver._id,
							partner: reciver._id,
							lastMessage: message._id,
						},
						{
							creator: reciver._id,
							roomId: userData._id + "-" + reciver._id,
							partner: userData._id,
							lastMessage: message._id,
						},
					]);
					if (reciver.chat.connection) {
						// console.log(reciver.chat);
						socket.broadcast.to(reciver.chat.socketId).emit("message", message);
					}
					io.in(newTo).emit("message", message);
				}
			} else {
				return socket.emit("error", "Sorry, you aren't at this community");
			}
		} else {
			const reciverRoom = await Room.findOne({
				partner: userData._id,
				creator: toId,
				activation: true,
			});

			if (reciverRoom) {
				const message = await Message.create({
					content: content,
					sender: userData._id,
					room: roomData.roomId,
				});
				await Room.findByIdAndUpdate(
					roomData._id,
					{ lastMessage: message._id },
					{ new: true },
				);
				await Room.findByIdAndUpdate(
					reciverRoom._id,
					{ lastMessage: message._id },
					{ new: true },
				);
				io.in(roomData.roomId).emit("message", message);
			} else {
				const message = await Message.create({
					content: content,
					sender: userData._id,
					room: roomData.roomId,
				});
				await Room.findByIdAndUpdate(
					roomData._id,
					{ lastMessage: message._id },
					{ new: true },
				);
				socket.emit("message", message);
			}
		}
	};
};
