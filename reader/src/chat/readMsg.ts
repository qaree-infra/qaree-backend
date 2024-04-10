import mongoose from "mongoose";
import Message, { MessageInterface } from "../models/message.js";

export default (io, socket) => {
	return async ({ msgId }) => {
		const userData = socket.handshake["authData"].user;
		const rooms = userData.rooms;
		if (!mongoose.isObjectIdOrHexString(msgId)) {
			return socket.emit("error", "invalid msg id");
		}

		const msg: MessageInterface = await Message.findById(msgId);
		if (!msg) return socket.emit("error", "invalid msg id");
		if (msg.sender === userData._id)
			return socket.emit("error", "sorry, you can't read your message");

		if (!rooms.includes(msg.room)) {
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
