import mongoose, { Schema } from "mongoose";

export interface BookReviewInterface {
	_id: Schema.Types.ObjectId;
	user: Schema.Types.ObjectId;
	bookId: string;
	rate: number;
	content: string;
	likes: [string];
	createdAt: Date;
	updatedAt: Date;
}

const bookReviewSchema: Schema = new mongoose.Schema<BookReviewInterface>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		bookId: {
			type: String,
			trim: true
		},
		rate: {
			type: Number,
			required: [true, "please, enter the rate"],
		},
		content: {
			type: String,
			trim: true,
		},
		likes: {
			type: [{ type: String }],
		},
	},
	{
		timestamps: true,
	},
);

const BookReview = mongoose.model<BookReviewInterface>("BookReview", bookReviewSchema);

export default BookReview;
