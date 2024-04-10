import mongoose, { Schema } from "mongoose";

export interface CommunityInterface {
	_id: string;
	members: [{ user: Schema.Types.ObjectId; role: 1 | 2 | 3 }];
	book: Schema.Types.ObjectId;
}

const CommunitySchema: Schema = new mongoose.Schema<CommunityInterface>({
	members: {
		type: [
			{ user: { type: Schema.Types.ObjectId, ref: "User" }, role: Number },
		],
		default: [],
	},
	book: {
		type: Schema.Types.ObjectId,
		ref: "Book",
		require: [true, "please enter book id"],
	},
});

const Community = mongoose.model<CommunityInterface>(
	"Community",
	CommunitySchema,
);

export default Community;
