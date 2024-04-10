import mongoose, { Schema } from "mongoose";

export interface MessageInterface {
	_id: string;
	content: string;
	sender: Schema.Types.ObjectId;
	room: string;
	// reciver: string;
	reader: [Schema.Types.ObjectId];
}

const userSchema: Schema = new mongoose.Schema<MessageInterface>(
	{
		content: {
			type: String,
			require: [true, "please enter your name!"],
			trim: true,
		},
		sender: {
			type: Schema.Types.ObjectId,
			require: [true, "please enter the message sender!"],
			trim: true,
			ref: "User",
		},
		// reciver: {
		// 	type: String,
		// 	require: [true, "please enter the massage reciver!"],
		// },
		reader: {
			type: [Schema.Types.ObjectId],
			ref: "User",
		},
		room: {
			type: String,
			require: [true, "please enter the message room!"],
		},
	},
	{
		timestamps: true,
	},
);

const Message = mongoose.model<MessageInterface>("Message", userSchema);

export default Message;