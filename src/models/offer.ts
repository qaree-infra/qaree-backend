import mongoose, { Schema } from "mongoose";

export interface OfferInterface {
	_id: string;
	percent: number;
	book: Schema.Types.ObjectId;
}

const offerSchema: Schema = new Schema<OfferInterface>(
	{
		percent: {
			type: Number,
			require: [true, "please enter offer percent"],
		},
		book: {
			type: Schema.Types.ObjectId,
			ref: "Book",
			require: [true, "please enter book id"],
		},
	},
	{
		timestamps: true,
	},
);

const Offer = mongoose.model<OfferInterface>("Offer", offerSchema);

export default Offer;
