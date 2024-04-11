import User from "../models/user.js";
import Message from "../models/message.js";
import Room from "../models/chatRoom.js";

export default (io, socket) => {
	return async ({ content, to }) => {
		const userData = socket.handshake["authData"].user;

		console.log(content, to);
		if (content.length === 0) return socket.emit("error", "Empty content");
		if (content.length > 500)
			return socket.emit(
				"error",
				"Message content length must be less than 500 char",
			);
		if (!to || to.trim().length === 0)
			return socket.emit("error", "Invalid recipient ID format");
		const toId = to.split("-")[1] || "";
		const fromRooms = await Room.find({
			$or: [
				{
					creator: userData._id,
					partner: to.split("-")[1],
				},
				{
					roomId: to,
				},
				{
					book: to,
				},
			],
		});

		if (fromRooms.length === 0) {
			if (to.includes("user")) {
				const reciverId = toId === userData._id;
				if (reciverId)
					return socket.emit("error", "sorry, you can't send message to you");
				const reciver = await User.findById(toId);
				if (!reciver) return socket.emit("error", "invalid reciver");
				else {
					const newTo = `${userData._id}-${toId}`;
					await socket.join(newTo);
					if (reciver.chat.connection) {
						console.log(reciver.chat);
						socket.broadcast
							.to(reciver.chat.socketId)
							.emit("message", { content, to: newTo });
					}
					console.log(newTo);
					const message = await Message.create({
						content: content,
						sender: userData._id,
						room: newTo,
					});
					await Room.insertMany([
						{
							creator: userData._id,
							name: reciver.name,
							avatar: reciver.avatar,
							roomId: userData._id + "-" + reciver._id,
							partners: reciver._id,
							lastMessage: message._id,
						},
						{
							creator: reciver._id,
							name: userData.name,
							avatar: userData.avatar,
							roomId: userData._id + "-" + reciver._id,
							partners: userData._id,
							lastMessage: message._id,
						},
					]);
					io.in(newTo).emit("message", message);
				}
			} else {
				return socket.emit("error", "Sorry, you aren't at this community");
			}
		} else {
			const message = await Message.create({
				content: content,
				sender: userData._id,
				room: fromRooms[0].roomId,
			});
			await Room.findByIdAndUpdate(
				fromRooms[0]._id,
				{ lastMessage: message._id },
				{ new: true },
			);
			console.log(fromRooms[0]);
			io.in(fromRooms[0].roomId).emit("message", message);
		}
	};
};
