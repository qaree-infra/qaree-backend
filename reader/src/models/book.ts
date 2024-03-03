import mongoose, { Schema } from "mongoose";

type bookStatus = "draft" | "inReview" | "publised" | "rejected";

export interface BookInterface {
	_id: string;
	name: string;
	description: string;
	isbn: string;
	edition: number;
	publishingRights: boolean;
	categories: Array<Schema.Types.ObjectId>;
	avgRate: number;
	price: number;
	cover: Schema.Types.ObjectId;
	file: Schema.Types.ObjectId;
	sample: Schema.Types.ObjectId;
	deleted: boolean;
	language: string;
	author: Schema.Types.ObjectId;
	reviewer: Schema.Types.ObjectId;
	status: bookStatus;
	createdAt: Date;
	updatedAt: Date;
	publishionDate: Date;
	previousPublishingData: Date;
	rejectionReasons: string;
	bookReads: {
		purchased: Array<Schema.Types.ObjectId>;
		sample: Array<Schema.Types.ObjectId>;
	};
}

const bookSchema: Schema = new mongoose.Schema<BookInterface>(
	{
		name: {
			type: String,
			require: [true, "please enter book name!"],
			trim: true,
		},
		description: {
			type: String,
			require: [true, "please enter book description!"],
			trim: true,
		},
		isbn: {
			type: String,
			trim: true,
			default: "",
		},
		edition: {
			type: Number,
			default: 1,
		},
		publishingRights: {
			type: Boolean,
			require: [true, "this field is required"],
			trim: true,
		},
		categories: {
			type: [Schema.Types.ObjectId],
			ref: "Category",
			require: [true, "this field is required"],
		},
		avgRate: {
			type: Number,
			default: 0,
		},
		cover: {
			type: Schema.Types.ObjectId,
			ref: "File",
		},
		file: {
			type: Schema.Types.ObjectId,
			ref: "File",
		},
		sample: {
			type: Schema.Types.ObjectId,
			ref: "File",
		},
		deleted: {
			type: Boolean,
			default: false,
		},
		language: {
			type: String,
			require: [true, "please enter book language!"],
			trim: true,
		},
		author: {
			type: Schema.Types.ObjectId,
			require: [true, "please enter book author!"],
			ref: "User",
		},
		reviewer: {
			type: Schema.Types.ObjectId,
			ref: "Admin",
		},
		status: {
			type: String,
			default: "draft",
			trim: true,
		},
		price: {
			type: Number,
			default: 0,
		},
		previousPublishingData: {
			type: Date,
		},
		publishionDate: {
			type: Date,
		},
		rejectionReasons: {
			type: String,
			default: "",
		},
		bookReads: {
			purchased: [{ type: Schema.Types.ObjectId, ref: "BookRead" }],
			sample: [{ type: Schema.Types.ObjectId, ref: "BookRead" }],
		},
	},
	{
		timestamps: true,
	},
);

bookSchema.index(
	{ updatedAt: 1 },
	{
		partialFilterExpression: { deleted: true },
		expireAfterSeconds: 300, // real value: 2592000, The TTL index expireAfterSeconds value must be within 0 and 2147483647 inclusive.
	},
);

const Book = mongoose.model<BookInterface>("Book", bookSchema);

export default Book;
