import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from "graphql";
import resolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "JoinBookCommunity",
	description: "",
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
	bookId: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type,
	args,
	resolve,
};
