import mongoose, { Schema } from "mongoose";

export interface OfferInterface {
	_id: string;
	percent: number;
	book: Schema.Types.ObjectId;
	expireAt: Date;
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
		expireAt: {
			type: Date,
			require: [true, "please enter offer expire date"],
		},
	},
	{
		timestamps: true,
	},
);

offerSchema.index(
	{ createdAt: 1 },
	{
		expireAfterSeconds: 0,
		partialFilterExpression: { expireAt: { $eq: new Date() } },
	},
);

const Offer = mongoose.model<OfferInterface>("Offer", offerSchema);

export default Offer;
