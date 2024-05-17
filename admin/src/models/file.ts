import mongoose from "mongoose";

export interface FileInterface {
	_id: string;
	name: string;
	size: number;
	path: string;
	type: string;
	userId: string;
	deleted: boolean;
	assets?: Array<{ path: string; length: number }>;
}

const fileSchema = new mongoose.Schema<FileInterface>(
	{
		name: {
			type: String,
			require: [true, "please enter the file name"],
			trim: true,
		},
		size: {
			type: Number,
			require: [true, "please enter the file size in bytes"],
		},
		path: {
			type: String,
			require: [true, "please enter the file path"],
			trim: true,
		},
		type: {
			type: String,
			require: [true, "please enter the file type"],
			trim: true,
		},
		userId: {
			type: String,
			require: [true, "please enter the userId"],
			trim: true,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
		assets: {
			type: [{ path: { type: String }, length: { type: Number } }],
		},
	},
	{
		timestamps: true,
	},
);

fileSchema.index(
	{ updatedAt: 1 },
	{
		partialFilterExpression: { deleted: true },
		expireAfterSeconds: 2592000, // real value: 2592000, The TTL index expireAfterSeconds value must be within 0 and 2147483647 inclusive.
	},
);

const File = mongoose.model<FileInterface>("File", fileSchema);

export default File;
