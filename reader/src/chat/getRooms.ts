import mongoose from "mongoose";
import Room from "../models/chatRoom.js";

export default (io, socket) => {
	return async ({ page, limit, keyword = "" }) => {
		const userData = socket.handshake["authData"].user;

		const startIndex = (Number(page || 1) - 1) * limit;
		console.log(keyword);
		const keys = keyword
			?.trim()
			?.split(" ")
			.map((e: string) => new RegExp(e, "gi"));

		console.log(keys);

		const orOptions = [
			{
				// $or: [{ name: { $in: keys } }],
				creator: userData._id,
				activation: true,
			},
			{
				// $or: [{ name: { $in: keys } }],
				// members: { $elemMatch: { user: userData._id } },
				members: { $in: [userData._id] },
				activation: true,
			},
		];

		const roomData = await Room.aggregate([
			{
				$lookup: {
					from: "users", // Foreign collection for partner
					localField: "partner", // Local field in Room schema (ObjectId)
					foreignField: "_id", // Foreign field in User schema (ObjectId)
					as: "partner",
				},
			},
			{
				$unwind: {
					path: "$partner",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: "files", // Foreign collection for avatar
					localField: "partner.avatar", // Local field in User schema (ObjectId)
					foreignField: "_id", // Foreign field in File schema (ObjectId)
					as: "partner.avatar",
				},
			},
			{
				$unwind: {
					path: "$partner.avatar",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: "books", // Foreign collection for book
					localField: "book", // Local field in Room schema (ObjectId)
					foreignField: "_id", // Foreign field in Book schema (ObjectId)
					as: "book",
				},
			},
			{
				$unwind: {
					path: "$book",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: "files", // Foreign collection for avatar
					localField: "book.cover", // Local field in User schema (ObjectId)
					foreignField: "_id", // Foreign field in File schema (ObjectId)
					as: "book.cover",
				},
			},
			{
				$unwind: {
					path: "$book.cover",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: "messages", // Foreign collection for book
					localField: "lastMessage", // Local field in Room schema (ObjectId)
					foreignField: "_id", // Foreign field in Book schema (ObjectId)
					as: "lastMessage",
				},
			},
			{
				$unwind: {
					path: "$lastMessage",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: "users", // Foreign collection for avatar
					localField: "lastMessage.sender", // Local field in User schema (ObjectId)
					foreignField: "_id", // Foreign field in File schema (ObjectId)
					as: "lastMessage.sender",
				},
			},
			{
				$unwind: {
					path: "$lastMessage.sender",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: "files", // Foreign collection for avatar
					localField: "lastMessage.sender.avatar", // Local field in User schema (ObjectId)
					foreignField: "_id", // Foreign field in File schema (ObjectId)
					as: "lastMessage.sender.avatar",
				},
			},
			{
				$unwind: {
					path: "$lastMessage.sender.avatar",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$match: {
					$or: [
						{
							"partner.name": { $in: keys },
							creator: userData._id,
							activation: true,
						},
						{
							"book.name": { $in: keys },
							members: { $in: [userData._id] },
							activation: true,
						},
						{
							"lastMessage.content": { $in: keys },
							$or: [
								{
									creator: userData._id,
									activation: true,
								},
								{
									members: { $in: [userData._id] },
									activation: true,
								},
							],
						},
					],
				},
			},
			{
				$project: {
					_id: 1,
					partner: {
						_id: 1,
						name: 1,
						avatar: {
							path: 1,
						},
						bio: 1,
					},
					book: {
						_id: 1,
						name: 1,
						cover: {
							path: 1,
						},
					},
					lastMessage: {
						_id: 1,
						content: 1,
						sender: {
							_id: 1,
							name: 1,
							avatar: {
								path: 1,
							},
							bio: 1,
						},
						room: 1,
						reader: 1,
						createdAt: 1,
						updatedAt:1
					},
					activation: 1,
					creator: 1,
					roomId: 1,
					members: 1,
				},
			},
		]);

		console.log(roomData);

		if (roomData) {
			socket.emit("get-rooms", {
				rooms: roomData,
				// totalRooms,
				currentPage: Number(page || 1),
				// numberOfPages: Math.ceil(totalRooms / (limit || 10)),
			});
		} else {
			socket.emit("error", "This is room not found");
		}
	};
};
