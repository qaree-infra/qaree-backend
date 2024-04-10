import Message from "../models/message.js";
// type read for read messages, unread for new messages
export default (io, socket) => {
	return async ({ room, limit, page, type }) => {
		const userData = socket.handshake["authData"].user;

		if (userData.rooms.includes(room)) {
			const startIndex = (Number(page || 1) - 1) * Number(limit || 10);
			const roomMsgs = await Message.find({ room })
				.sort({ createdAt: type === "read" ? 1 : -1 })
				.limit(Number(limit || 10))
				.skip(startIndex)
				.populate([
					{
						path: "sender",
						options: { populate: "avatar" },
					},
					{
						path: "reader",
						options: { populate: "avatar" },
					},
				]);

			io.to(socket.id).emit("message-list", {
				messages: roomMsgs,
				userId: userData._id,
			});
		} else {
			io.to(socket.id).emit("message-list", {
				messages: [],
				userId: userData._id,
			});
		}
	};
};
