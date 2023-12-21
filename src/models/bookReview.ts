import mongoose, { Schema } from "mongoose";

export interface BookReview {
	_id: Schema.Types.ObjectId;
	user: Schema.Types.ObjectId;
	rate: number;
	content: string;
	likes: [Schema.Types.ObjectId];
	createdAt: Date;
	updatedAt: Date;
}

const bookReviewSchema: Schema = new mongoose.Schema<BookReview>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
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
			type: [{ type: Schema.Types.ObjectId, ref: "User" }],
		},
	},
	{
		timestamps: true,
	},
);

const BookReview = mongoose.model<BookReview>("BookReview", bookReviewSchema);

export default BookReview;
