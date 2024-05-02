import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLInt,
	GraphQLString,
	GraphQLList,
} from "graphql";
import resolve from "./resolve.js";

const notificationType = new GraphQLObjectType({
	name: "Notification",
	description: "This is the notification type",
	fields: {
		_id: {
			type: GraphQLID,
		},
		title: {
			type: GraphQLString,
		},
		body: {
			type: GraphQLString,
		},
		type: {
			type: GraphQLString,
		},
		image: {
			type: GraphQLString,
		},
		data: {
			type: new GraphQLObjectType({
				name: "NotificationData",
				fields: {
					bookId: {
						type: GraphQLString,
					},
					userId: {
						type: GraphQLString,
					},
					reviewId: {
						type: GraphQLString,
					},
					roomId: {
						type: GraphQLString,
					},
				},
			}),
		},
		createdAt: {
			type: GraphQLString,
		},
		updatedAt: {
			type: GraphQLString,
		},
	},
});

const type = new GraphQLObjectType({
	name: "GetNotifications",
	fields: {
		notifications: {
			type: new GraphQLList(notificationType),
			description: "This is the notifications list",
		},
		total: {
			type: GraphQLInt,
			description: "",
		},
		currentPage: {
			type: GraphQLInt,
			description: "",
		},
		numberOfPages: {
			type: GraphQLInt,
			description: "",
		},
	},
});

const args = {
	limit: {
		type: GraphQLInt,
		description: "",
	},
	page: {
		type: GraphQLInt,
		description: "",
	},
};

export default {
	type,
	args,
	resolve,
};
