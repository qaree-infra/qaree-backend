import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
import resolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "DeleteChat",
	description: "this is the delete chat type",
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
	room: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type,
	args,
	resolve,
};
