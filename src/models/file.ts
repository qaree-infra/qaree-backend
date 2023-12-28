import mongoose from "mongoose";

export interface FileInterface {
	_id: string;
	name: string;
	size: number;
	path: string;
	type: string;
	userId: string;
	deleted: boolean;
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
			default: false
		}
	},
	{
		timestamps: true,
	},
);

fileSchema.index(
	{ updatedAt: 1 },
	{
		partialFilterExpression: { deleted: true },
		expireAfterSeconds: 300, // real value: 2592000, The TTL index expireAfterSeconds value must be within 0 and 2147483647 inclusive.
	},
);

const File = mongoose.model<FileInterface>("File", fileSchema);

export default File;
