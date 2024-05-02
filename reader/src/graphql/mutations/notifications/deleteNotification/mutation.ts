import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from "graphql";
import resolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "DeleteNotification",
	description: "Delete notification",
	fields: {
		message: {
			type: GraphQLString,
			description: "",
		},
		success: {
			type: GraphQLBoolean,
			description: "",
		},
	},
});

const args = {
	notificationId: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type,
	args,
	resolve,
};
