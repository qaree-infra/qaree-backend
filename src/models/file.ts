import mongoose from "mongoose";

export interface FileInterface {
	_id: string;
	name: string;
	size: number;
	path: string;
	type: string;
	userId: string;
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
	},
	{
		timestamps: true,
	},
);

const File = mongoose.model<FileInterface>("File", fileSchema);

export default File;
