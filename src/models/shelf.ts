import mongoose, { Schema } from "mongoose";

export interface ShelfInterface {
	_id: Schema.Types.ObjectId;
	name: string;
	userId: string;
	books: [Schema.Types.ObjectId];
	createdAt: Date;
	updatedAt: Date;
}

const shelfSchema: Schema = new mongoose.Schema<ShelfInterface>(
	{
		name: {
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
