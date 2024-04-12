import mongoose from "mongoose";
import { auth } from "../../../../../middleware/general/auth.js";
import verifyBook from "../../../../../middleware/general/verifyBook.js";
import BookRead from "../../../../../models/bookRead.js";
import Room from "../../../../../models/chatRoom.js";

export default async function resolve(
	_,
	args: { bookId: string; id: string },
	context,
) {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;
		if (auth.error) throw new Error(auth.error);

		const { bookId, id } = args;
		console.log(bookId);

		const bookVerification = await verifyBook(bookId, context);
		if (bookVerification.error) throw new Error(bookVerification.error);

		const orOptions = [
			{
				_id: id,
			},
			{
				roomId: bookVerification.bookData._id,
				members: { $in: [auth.user._id] },
				activation: true,
			},
			{
				members: { $in: [auth.user._id] },
				book: bookVerification.bookData._id,
				activation: true,
			},
		];

		const bookCommunity = await Room.findOne({
			$or: orOptions,
		}).populate([
			{
				path: "book",
				options: {
					select: "name cover",
					populate: { path: "cover" },
				},
			},
			{
				path: "members",
				options: {
					select: "-password",
					populate: { path: "avatar" },
					limit: 10,
					skip: 0,
				},
			},
		]);

		// console.log(bookCommunity);

		const totalMembers = await Room.findOne({
			$or: orOptions,
		}).select("members");

		if (bookCommunity) {
			const returnedObject = Object.assign(
				{
					members: {
						members: bookCommunity.members,
						currentPage: 1,
						numberOfPages: Math.ceil(totalMembers.members.length / 10),
						totalMembers: totalMembers.members.length,
					},
				},
				{
					_id: bookCommunity._id,
					lastMessage: bookCommunity.lastMessage,
					book: bookCommunity.book,
					roomId: bookCommunity.roomId,
				},
			);

			return returnedObject;
		} else
			throw new Error(
				lang === "ar"
					? "عذراً، انت لست فى هذا المجتمع"
					: "you aren't at this community",
			);
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
