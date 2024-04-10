import User from "../models/user.js";
import Message from "../models/message.js";
import Community from "../models/community.js";

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
		const fromRooms = userData.rooms.find(
			(e) => e === to || e.split("-")[0] === toId || e.split("-")[1] === toId,
		);
		if (!fromRooms) {
			if (to.includes("user")) {
				const reciverId = toId === userData._id;
				if (reciverId)
					return socket.emit("error", "sorry, you can't send message to you");
				const reciver = await User.findById(toId);
				if (!reciver) return socket.emit("error", "invalid reciver");
				else {
					const newTo = fromRooms ? fromRooms : `${userData._id}-${toId}`;
					await socket.join(newTo);
					const newUser = await User.findByIdAndUpdate(
						userData._id,
						{ rooms: userData.rooms.concat([newTo]) },
						{ new: true },
					);
					await User.findByIdAndUpdate(
						reciver._id,
						{
							rooms: reciver.rooms.concat([newTo]),
						},
						{ new: true },
					);
					userData.rooms.push(newTo);
					userData.rooms = newUser.rooms;
					socket.handshake["authData"].user.rooms = newUser.rooms;
					if (reciver.chat.connection) {
						console.log(reciver.chat);
						socket.broadcast
							.to(reciver.chat.socketId)
							.emit("message", { content, to: newTo });
					}
					const message = await Message.create({
						content: content,
						sender: userData._id,
						room: newTo,
					});
					io.in(newTo).emit("message", message);
				}
			} else {
				const community = await Community.findOne({
					_id: to,
					members: { $in: [userData._id] },
				});
				if (community) {
					const message = await Message.create({
						content: content,
						sender: userData._id,
						room: to,
					});
					io.in(to).emit("message", { ...message, sender: userData });
				} else
					return socket.emit("error", "Sorry, you aren't at this community");
			}
		} else {
			const message = await Message.create({
				content: content,
				sender: userData._id,
				room: fromRooms,
			});
			io.in(fromRooms).emit("message", message);
		}
	};
};
