import mongoose, { Schema } from "mongoose";

export interface NotificationInterface {
	_id: string;
	title: string;
	body: string;
	image: string;
	user: Schema.Types.ObjectId;
	type: string;
	data: Object;
	createdAt: Date;
	updatedAt: Date;
}

const notificationSchema: Schema = new mongoose.Schema<NotificationInterface>(
	{
		title: {
			type: String,
			require: [true, "please enter notification title!"],
			trim: true,
		},
		body: {
			type: String,
			require: [true, "please enter notification body!"],
			trim: true,
		},
		image: {
			type: String,
			require: [true, "please enter notification image!"],
			trim: true,
		},
		type: {
			type: String,
			require: [true, "please enter the Notification type!"],
			trim: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			require: [true, "please enter the user notification!"],
			trim: true,
		},
		data: {
			type: Object,
			require: [true, "please enter the Notification data!"],
			trim: true,
		},
	},
	{
		timestamps: true,
	},
);

const Notification = mongoose.model<NotificationInterface>(
	"Notification",
	notificationSchema,
);

export default Notification;
