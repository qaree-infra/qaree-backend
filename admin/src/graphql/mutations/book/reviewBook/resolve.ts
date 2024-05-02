import mongoose from "mongoose";
import Book, { BookInterface } from "../../../../models/book.js";
import { auth } from "../../../../middleware/general/auth.js";
import User from "../../../../models/user.js";
import { generateNewBookNotification, sendFcmMessage } from "../../../../utils/sendNotification.js";
import Notification from "../../../../models/notification.js";

const reviewBookResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { bookId, status, content } = args;

		if (!bookId) {
			throw new Error("Please, enter the book id");
		}

		const bookData: BookInterface | null = await Book.findById(bookId);

		if (!mongoose.Types.ObjectId.isValid(bookId)) {
			throw new Error(
				lang === "ar" ? "معرف الكتاب غير صالح" : "Invalid book id.",
			);
		}

		if (bookData === null) {
			throw new Error(
				lang === "ar"
					? "غير مسموح لك اى عمليات على هذه البيانات"
					: "You are not allowed to show this book data",
			);
		}

		if (bookData.status !== "inReview") {
			throw new Error(
				lang === "ar"
					? "عزراً ليس لديك اى صلاحيات كى ترى بيانات هذا الكتاب"
					: "sorry, you don't have permitions to show this book data.",
			);
		}

		if (status !== "approved" && status !== "rejected") {
			throw new Error(
				lang === "ar"
					? "حالة مراجعة بيانات الكتاب غير صالحة"
					: "invalid review book data",
			);
		}

		if (status === "rejected" && !content) {
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل سبب الرفض"
					: "please, enter the rejection reasons",
			);
		}

		if (status === "approved") {
			await Book.findByIdAndUpdate(bookId, {
				status: status === "approved"? "published" : "rejected",
				publishionDate: new Date().toISOString(),
				reviewer: auth.admin._id
			});

			const reviewerFollowes = await User.find({
				following: { $in: [bookData.author] },
				"notifications.token": { $ne: "" },
			});

			reviewerFollowes.forEach((u) => {
				const notificationMsg = generateNewBookNotification(
					bookData,
					lang
				);

				notificationMsg.message.token = u.notifications.token;
				sendFcmMessage(notificationMsg);
				Notification.create({
					title: notificationMsg.message.notification.title,
					body: notificationMsg.message.notification.body,
					image: notificationMsg.message.notification.image,
					type: "new book",
					user: u._id,
					data: notificationMsg.message.data,
				});
			});

			return { success: true, message: "reviewed successfully" };
		} else {
			await Book.findByIdAndUpdate(bookId, {
				status: "rejected",
				rejectionReasons: content,
				reviewer: auth.admin._id
			});

			return { success: true, message: "reviewed successfully" };
		}
	} catch (error) {
		throw new Error(error);
	}
};

export default reviewBookResolve;
