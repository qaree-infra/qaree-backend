import mongoose, { Schema } from "mongoose";
import { BookInterface } from "./book.js";

type status = "sample" | "purchased";

export interface BookReadInterface {
	_id: string;
	book: Schema.Types.ObjectId | BookInterface;
	status: status;
	createdAt: Date;
	updatedAt: Date;
	readingProgress: number;
	user: Schema.Types.ObjectId;
	content: Array<{ length: number; chId: string }>;
}

const bookSchema: Schema = new mongoose.Schema<BookReadInterface>(
	{
		book: {
			type: Schema.Types.ObjectId,
			require: [true, "please enter book id!"],
			ref: "Book",
		},
		status: {
			type: String,
			trim: true,
			default: "sample",
		},
		content: {
			type: new Array({ length: Number, chId: String }),
			trim: true,
			default: [],
		},
		readingProgress: {
			type: Number,
			default: 0,
		},
		user: {
			type: Schema.Types.ObjectId,
			require: [true, "please enter user id!"],
			ref: "User",
		},
	},
	{
		timestamps: true,
	},
);

const BookRead = mongoose.model<BookReadInterface>("BookRead", bookSchema);

export default BookRead;
