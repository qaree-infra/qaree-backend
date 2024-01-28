import mongoose from "mongoose";
import Book, { BookInterface } from "../../../../../models/book.js";
import { adminAuth } from "../../../../../middleware/adminAuth.js";

const reviewBookResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const adminAuth: adminAuth = context.adminAuth;

		if (adminAuth?.error) throw new Error(adminAuth?.error);

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
				reviewer: adminAuth.admin._id
			});

			return { success: true, message: "reviewed successfully" };
		} else {
			await Book.findByIdAndUpdate(bookId, {
				status: "rejected",
				rejectionReasons: content,
				reviewer: adminAuth.admin._id
			});

			return { success: true, message: "reviewed successfully" };
		}
	} catch (error) {
		throw new Error(error);
	}
};

export default reviewBookResolve;
