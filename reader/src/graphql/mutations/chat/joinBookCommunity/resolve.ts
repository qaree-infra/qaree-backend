import mongoose from "mongoose";
import { auth } from "../../../../middleware/general/auth.js";
import verifyBook from "../../../../middleware/general/verifyBook.js";
import BookRead from "../../../../models/bookRead.js";
import Room from "../../../../models/chatRoom.js";
import Offer, { OfferInterface } from "../../../../models/offer.js";

export default async function resolve(_, args: { bookId: string }, context) {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;
		if (auth.error) throw new Error(auth.error);

		const { bookId } = args;
		console.log(bookId);

		const bookVerification = await verifyBook(bookId, context);
		if (bookVerification.error) throw new Error(bookVerification.error);

		const bookCommunity = await Room.findOne({
			book: bookVerification.bookData._id,
		});

		const bookOffer: OfferInterface = await Offer.findOne({ book: bookId });
		const bookPrice =
			(100 - Number(bookOffer?.percent || 0)) * bookVerification.bookData.price;

		if (bookPrice === 0) {
			if (bookCommunity) {
				await Room.findByIdAndUpdate(
					bookCommunity._id,
					{
						members: bookCommunity.members.concat([auth.user._id]),
					},
					{ new: true },
				);

				return {
					success: true,
					message:
						lang === "ar"
							? "لقد انضممت الى المجتمع بنجاج"
							: "You have joined community successfully",
				};
			} else {
				await Room.create({
					book: bookVerification.bookData._id,
					members: [bookVerification.bookData.author, auth.user._id],
					roomId: bookVerification.bookData._id,
				});

				return {
					success: true,
					message:
						lang === "ar"
							? "لقد انضممت الى المجتمع بنجاج"
							: "You have joined community successfully",
				};
			}
		} else {
			const userBookRead = await BookRead.findOne({
				user: auth.user._id,
				book: bookId,
			});

			if (userBookRead.status === "purchased") {
				if (bookCommunity) {
					await Room.findByIdAndUpdate(
						bookCommunity._id,
						{
							members: bookCommunity.members.concat([auth.user._id]),
						},
						{ new: true },
					);

					return {
						success: true,
						message:
							lang === "ar"
								? "لقد انضممت الى المجتمع بنجاج"
								: "You have joined community successfully",
					};
				} else {
					await Room.create({
						book: bookVerification.bookData._id,
						members: [bookVerification.bookData.author, auth.user._id],
						roomId: bookVerification.bookData._id,
					});

					return {
						success: true,
						message:
							lang === "ar"
								? "لقد انضممت الى المجتمع بنجاج"
								: "You have joined community successfully",
					};
				}
			} else
				throw new Error(
					lang === "ar"
						? "عفواً، لا يمكنك الانضمام لهذا المجتمع"
						: "Sorry, you can't join this book community",
				);
		}
	} catch (error) {
		throw new Error(error);
	}
}
