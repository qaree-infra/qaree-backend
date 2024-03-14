import mongoose, { Schema } from "mongoose";
import { BookInterface } from "./book.js";

export interface ShelfInterface {
	_id: Schema.Types.ObjectId;
	name_en: string;
	name_ar: string;
	userId: string;
	books: Array<Schema.Types.ObjectId> | Array<BookInterface>;
	// bookReads: Array<Schema.Types.ObjectId>;
	createdAt: Date;
	updatedAt: Date;
}

const shelfSchema: Schema = new mongoose.Schema<ShelfInterface>(
	{
		name_ar: {
			type: String,
			require: [true, "please enter shelf name!"],
			trim: true,
		},
		name_en: {
			type: String,
			require: [true, "please enter shelf name!"],
			trim: true,
		},
		books: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "Book",
				},
			],
		},
		// bookReads: {
		// 	type: [
		// 		{
		// 			type: Schema.Types.ObjectId,
		// 			ref: "BookRead",
		// 		},
		// 	],
		// },
		userId: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

const shelf = mongoose.model<ShelfInterface>("Shelf", shelfSchema);

export default shelf;
