import mongoose, { Schema } from "mongoose";

export interface UserInterface {
	_id: string;
	name: string;
	email: string;
	password: string;
	avatar?: string;
	valid: boolean;
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
			type: String,
			trim: true,
		},
		valid: {
			type: Boolean,
			default: false,
		},
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
