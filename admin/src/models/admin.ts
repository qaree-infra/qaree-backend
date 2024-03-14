import mongoose, { Schema } from "mongoose";

export interface AdminInterface {
	_id: string;
	name: string;
	email: string;
	password: string;
	avatar?: Schema.Types.ObjectId;
}

const adminSchema: Schema = new mongoose.Schema<AdminInterface>(
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
			ref: "File"
		},
	},
	{
		timestamps: true,
	},
);

const Admin = mongoose.model<AdminInterface>("Admin", adminSchema);

export default Admin;
