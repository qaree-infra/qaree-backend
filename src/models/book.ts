import mongoose, { Schema } from "mongoose";

export interface BookInterface {
	_id: string;
	name: string;
	description: string;
	isbn: string;
	edition: number;
	publishingRights: boolean;
	categories: Array<string>;
	completed: boolean;
	avgRate: number;
	price: number;
	coverUrl: string;
	fileUrl: string;
	sampleUrl: string;
	deleted: boolean;
	language: string;
	authorId: string;
	valid: boolean;
	createdAt: Date;
	updatedAt: Date;
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
			default: ""
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
			type: [String],
			require: [true, "this field is required"],
		},
		completed: {
			type: Boolean,
			require: [true, "this field is required"],
			default: false,
		},
		avgRate: {
			type: Number,
			default: 0,
		},
		coverUrl: {
			type: String,
			trim: true,
		},
		fileUrl: {
			type: String,
			trim: true,
		},
		sampleUrl: {
			type: String,
			trim: true,
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
		authorId: {
			type: String,
			require: [true, "please enter book author!"],
			trim: true,
		},
		valid: {
			type: Boolean,
			default: false,
		},
		price: {
			type: Number,
			default: 0,
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
		expireAfterSeconds: 300,
	},
);

const Book = mongoose.model<BookInterface>("Book", bookSchema);

export default Book;
