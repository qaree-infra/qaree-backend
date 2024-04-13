import mongoose from "mongoose";
import Message, { MessageInterface } from "../models/message.js";
import Room from "../models/chatRoom.js";

export default (io, socket) => {
	return async ({ msgId }) => {
		const userData = socket.handshake["authData"].user;
		if (!mongoose.isObjectIdOrHexString(msgId)) {
			return socket.emit("error", "invalid msg id");
		}

		const msg: MessageInterface = await Message.findById(msgId);
		if (!msg) return socket.emit("error", "invalid msg id");
		if (msg.sender === userData._id)
			return socket.emit("error", "sorry, you can't read your message");

		const orOptions =
			msg.room.split("-").length !== 2
				? [
						{
							roomId: msg.room,
							$or: [
								{ creator: userData._id },
								{ members: { $in: [userData._id] } },
							],
							activation: true,
						},
						{
							_id: msg.room,
							$or: [
								{ creator: userData._id },
								{ members: { $in: [userData._id] } },
							],
							activation: true,
						},
						{
							book: msg.room,
							members: { $in: [userData._id] },
							activation: true,
						},
				  ]
				: [
						{
							roomId: msg.room,
							creator: userData._id,
							partner: msg.room.split("-")[1],
							activation: true,
						},
				  ];

		const roomData = await Room.findOne({
			$or: orOptions,
		});

		if (!roomData) {
			return socket.emit(
				"error",
				"sorry, you can't read messages at this room",
			);
		}

		const updatedMsg: MessageInterface = await Message.findByIdAndUpdate(
			msgId,
			{ reader: msg.reader.concat([userData._id]) },
			{ new: true },
		);

		io.in(msg.room).emit("read", updatedMsg);
	};
};
