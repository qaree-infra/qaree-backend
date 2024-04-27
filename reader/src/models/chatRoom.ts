import mongoose, { Schema } from "mongoose";

export interface RoomInterface {
	_id: string;
	lastMessage: Schema.Types.ObjectId; // 2
	activation: boolean; // 2
	creator: Schema.Types.ObjectId; // 1 // me or author
	partner: Schema.Types.ObjectId; // 1 // other side
	book: Schema.Types.ObjectId | null; // 1
	members: [Schema.Types.ObjectId];
	roomId: string; // 2
}

const roomSchema: Schema = new mongoose.Schema<RoomInterface>(
	{
		lastMessage: {
			type: Schema.Types.ObjectId,
			ref: "Message",
		},
		activation: {
			type: Boolean,
			default: true,
		},
		creator: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		partner: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		book: {
			type: Schema.Types.ObjectId,
			ref: "Book",
		},
		roomId: {
			type: String,
		},
		members: {
			type: [Schema.Types.ObjectId],
			ref: "User"
		}
	},
	{
		timestamps: true,
	},
);

const Room = mongoose.model<RoomInterface>("Room", roomSchema);

export default Room;
