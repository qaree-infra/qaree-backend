import mongoose, { Schema } from "mongoose";

type status = "sample" | "free" | "purchased";

export interface BookReadInterface {
	_id: string;
	book: Schema.Types.ObjectId;
	status: status;
	createdAt: Date;
	updatedAt: Date;
	readingProgress: number;
	user: Schema.Types.ObjectId;
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
