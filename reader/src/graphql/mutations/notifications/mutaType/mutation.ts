import { GraphQLObjectType, GraphQLBoolean, GraphQLString } from "graphql";
import resolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "MuteNotifications",
	description: "Mute notifications",
	fields: {
		success: {
			type: GraphQLBoolean,
			description: "",
		},
		message: {
			type: GraphQLString,
			description: "",
		},
	},
});

const args = {
	type: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type,
	args,
	resolve,
};
