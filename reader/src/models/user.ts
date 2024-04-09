import mongoose, { Schema } from "mongoose";

export interface UserInterface {
	_id: string;
	name: string;
	email: string;
	password: string;
	avatar?: Schema.Types.ObjectId;
	valid: boolean;
	followers?: Array<Schema.Types.ObjectId>;
	following?: Array<Schema.Types.ObjectId>;
	books?: Array<Schema.Types.ObjectId>;
	bookReads: Array<Schema.Types.ObjectId>;
	bio: string;
	chat: {
		connection: boolean;
		socketId: string;
	};
	rooms: [string];
}

const userSchema: Schema = new mongoose.Schema<UserInterface>(
	{
		name: {
			type: String,
			require: [true, "please enter your name!"],
			trim: true,
		},
		email: {
			type: String,
			require: [true, "please enter your name!"],
			trim: true,
			index: true,
			unique: true,
		},
		password: {
			type: String,
			require: [true, "please enter your password!"],
		},
		avatar: {
			type: Schema.Types.ObjectId,
			ref: "File",
		},
		valid: {
			type: Boolean,
			default: false,
		},
		followers: {
			type: [Schema.Types.ObjectId],
			ref: "User",
		},
		following: {
			type: [Schema.Types.ObjectId],
			ref: "User",
		},
		books: {
			type: [Schema.Types.ObjectId],
			ref: "Book",
		},
		bio: {
			type: String,
			default: "",
		},
		chat: {
			type: {
				connection: {
					type: Boolean,
				},
				socketId: {
					type: String,
				},
			},
			default: { connection: false, socketId: "" },
		},
		rooms: { type: [String], default: [] }, // community and uid-uid
	},
	{
		timestamps: true,
	},
);

userSchema.index(
	{ createdAt: 1 },
	{
		partialFilterExpression: { valid: true },
		expireAfterSeconds: 300,
	},
);

const User = mongoose.model<UserInterface>("User", userSchema);

export default User;
