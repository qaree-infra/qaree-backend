import mongoose from "mongoose";

export interface CategoryInterface {
	_id: string;
	name_ar: string;
	name_en: string;
	icon: mongoose.Schema.Types.ObjectId;
	adminId: string;
	createdAt: Date;
	updatedAt: Date;
	background: string;
}

const categorySchema = new mongoose.Schema<CategoryInterface>(
	{
		name_ar: {
			type: String,
			require: [true, "please enter the category name in arabic"],
			trim: true,
		},
		name_en: {
			type: String,
			require: [true, "please enter the category name in english"],
			trim: true,
		},
		adminId: {
			type: String,
			require: [true, "please enter the adminId"],
			trim: true,
		},
		icon: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "File",
		},
		background: {
			type: String,
			default: "#186cb0",
		},
	},
	{
		timestamps: true,
	},
);

const Category = mongoose.model<CategoryInterface>("Category", categorySchema);

export default Category;
