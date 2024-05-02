import User from "../models/user.js";
import Message from "../models/message.js";
import Room from "../models/chatRoom.js";
import {
	generateMessageNotification,
	sendFcmMessage,
} from "../utils/sendNotification.js";
import Notification from "../models/notification.js";

export default (io, socket) => {
	return async ({ content, to }) => {
		const userData = socket.handshake["authData"].user;
		const lang = socket.handshake.headers.query.lang;

		console.log(content, to);
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
		console.log(content, roomData);

		if (
			roomData?.members.length > 0 &&
			!roomData?.members?.includes(userData._id)
		) {
			return socket.emit("error", "invalid room");
		}

		const reciver = await User.findById(toId);
		console.log(reciver);
		if (!roomData) {
			if (to.includes("user")) {
				const reciverId = toId === userData._id;
				if (reciverId)
					return socket.emit("error", "sorry, you can't send message to you");
				if (!reciver) return socket.emit("error", "invalid reciver");
				else {
					const newTo = `${userData._id}-${toId}`;
					await socket.join(newTo);
					await console.log("newTo: ", newTo);
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
						console.log("reciver.chat: ", reciver.chat);
						socket.broadcast.to(reciver.chat.socketId).emit("message", {
							_id: message._id,
							content: message.content,
							sender: {
								_id: userData._id,
								name: userData.name,
								avatar: userData.avatar,
								bio: userData.bio,
								email: userData.email,
							},
							room: newTo,
							createdAt: message.createdAt,
							updatedAt: message.updatedAt,
							reader: message.reader,
						});
					}
					if (reciver.notifications.token) {
						const notificationMsg = generateMessageNotification(
							userData.avatar.path,
							content,
							userData,
							roomData._id,
							lang,
						);

						notificationMsg.message.token = reciver.notifications.token;
						sendFcmMessage(notificationMsg);
						Notification.create({
							title: notificationMsg.message.notification.title,
							body: notificationMsg.message.notification.body,
							image: notificationMsg.message.notification.image,
							type: "reviewing book notifcation",
							user: reciver._id,
							data: notificationMsg.message.data,
						});
					}
					io.in(newTo).emit("message", {
						_id: message._id,
						content: message.content,
						sender: {
							_id: userData._id,
							name: userData.name,
							avatar: userData.avatar,
							bio: userData.bio,
							email: userData.email,
						},
						room: newTo,
						createdAt: message.createdAt,
						updatedAt: message.updatedAt,
						reader: message.reader,
					});
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
				if (reciver.chat.connection) {
					socket.broadcast.to(reciver.chat.socketId).emit("message", {
						_id: message._id,
						content: message.content,
						sender: {
							_id: userData._id,
							name: userData.name,
							avatar: userData.avatar,
							bio: userData.bio,
							email: userData.email,
						},
						room: roomData.roomId,
						createdAt: message.createdAt,
						updatedAt: message.updatedAt,
						reader: message.reader,
					});
					socket.emit("message", {
						_id: message._id,
						content: message.content,
						sender: {
							_id: userData._id,
							name: userData.name,
							avatar: userData.avatar,
							bio: userData.bio,
							email: userData.email,
						},
						room: roomData.roomId,
						createdAt: message.createdAt,
						updatedAt: message.updatedAt,
						reader: message.reader,
					});
				} else {
					if (reciver.notifications.token) {
						const notificationMsg = generateMessageNotification(
							userData.avatar.path,
							content,
							userData,
							roomData._id,
							lang,
						);

						notificationMsg.message.token = reciver.notifications.token;
						sendFcmMessage(notificationMsg);
						Notification.create({
							title: notificationMsg.message.notification.title,
							body: notificationMsg.message.notification.body,
							image: notificationMsg.message.notification.image,
							type: "reviewing book notifcation",
							user: reciver._id,
							data: notificationMsg.message.data,
						});
					}
					io.in(roomData.roomId).emit("message", {
						_id: message._id,
						content: message.content,
						sender: {
							_id: userData._id,
							name: userData.name,
							avatar: userData.avatar,
							bio: userData.bio,
							email: userData.email,
						},
						room: roomData.roomId,
						createdAt: message.createdAt,
						updatedAt: message.updatedAt,
						reader: message.reader,
					});
				}
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
				io.in(roomData.roomId).emit("message", {
					_id: message._id,
					content: message.content,
					sender: {
						_id: userData._id,
						name: userData.name,
						avatar: userData.avatar,
						bio: userData.bio,
						email: userData.email,
					},
					room: roomData.roomId,
					createdAt: message.createdAt,
					updatedAt: message.updatedAt,
					reader: message.reader,
				});
			}
		}
	};
};
