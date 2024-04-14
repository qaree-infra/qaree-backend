import Room from "../models/chatRoom.js";
import Message from "../models/message.js";
// type read for read messages, unread for new messages
export default (io, socket) => {
	return async ({ room, limit, page, type }) => {
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
			const startIndex = (Number(page || 1) - 1) * Number(limit || 10);
			const roomMsgs = await Message.find({ room: roomData.roomId })
				.sort({ createdAt: type === "read" ? 1 : -1 })
				.limit(Number(limit || 10))
				.skip(startIndex)
				.populate([
					{
						path: "sender",
						options: { populate: "avatar", select: "_id name avatar bio" },
					},
					{
						path: "reader",
						options: { populate: "avatar", select: "_id name avatar bio" },
					},
				]);

			const totalMessages = await Message.countDocuments({
				room: roomData.roomId,
			});

			socket.emit("message-list", {
				messages: {
					messages: roomMsgs,
					totalMessages: totalMessages,
					currentPage: page || 1,
					numberOfPages: Math.ceil(totalMessages / (limit || 10)),
				},
				userId: userData._id,
			});
		} else {
			socket.emit("message-list", {
				messages: { messages: [] },
				userId: userData._id,
			});
		}
	};
};
