import mongoose, { Schema } from "mongoose";

interface UserInterface {
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
			// index: {
			// 	partialFilterExpression: { valid: false },
			// 	expireAfterSeconds: 300,
			// },
		},
	},
	{
		timestamps: true,
	},
);

userSchema.index(
	{ valid: 1 },
	{
		partialFilterExpression: { valid: false },
		expireAfterSeconds: 300,
	},
);

const User = mongoose.model<UserInterface>("User", userSchema);

export default User;
