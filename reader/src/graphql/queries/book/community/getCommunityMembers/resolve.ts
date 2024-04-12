import mongoose from "mongoose";
import { auth } from "../../../../../middleware/general/auth.js";
import verifyBook from "../../../../../middleware/general/verifyBook.js";
import BookRead from "../../../../../models/bookRead.js";
import Room from "../../../../../models/chatRoom.js";

export default async function resolve(
	_,
	args: { bookId: string; id: string; limitMembers: number; page: number },
	context,
) {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;
		if (auth.error) throw new Error(auth.error);

		const { bookId, id, limitMembers, page } = args;
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

		const currentPage = Number(page || 1);
		const startIndex = (Number(currentPage) - 1) * (Number(limitMembers) || 10);

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
					limit: Number(limitMembers) || 10,
					skip: startIndex,
				},
			},
		]);

		// console.log(bookCommunity);

		const totalMembers = await Room.findOne({
			$or: orOptions,
		}).select("members");

		if (bookCommunity) {
			return {
				members: bookCommunity.members,
				currentPage,
				numberOfPages: Math.ceil(
					totalMembers.members.length / Number(limitMembers || 10),
				),
				totalMembers: totalMembers.members.length,
			};
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
