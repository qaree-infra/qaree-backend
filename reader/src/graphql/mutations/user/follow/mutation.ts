import { GraphQLObjectType, GraphQLBoolean, GraphQLString } from "graphql";
import resolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "FollowUser",
	description: "this is the follow user mutation type",
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
	userId: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type,
	args,
	resolve,
};
