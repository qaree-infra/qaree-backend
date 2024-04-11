import Room from "../models/chatRoom.js";
import Message from "../models/message.js";
// type read for read messages, unread for new messages
export default (io, socket) => {
	return async ({ room, limit, page, type }) => {
		const userData = socket.handshake["authData"].user;

		const roomData = await Room.find({
			$or: [
				{
					roomId: room,
				},
				{
					book: room,
				},
				{
					creator: userData._id,
					partner: room.split("-")[1],
				},
			],
		});

		if (roomData.length > 0) {
			const startIndex = (Number(page || 1) - 1) * Number(limit || 10);
			const roomMsgs = await Message.find({ room: roomData[0].roomId })
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

			socket.emit("message-list", {
				messages: roomMsgs,
				userId: userData._id,
			});
		} else {
			socket.emit("message-list", {
				messages: [],
				userId: userData._id,
			});
		}
	};
};
