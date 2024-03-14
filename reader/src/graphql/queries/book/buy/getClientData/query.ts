import { GraphQLObjectType, GraphQLString } from "graphql";
import resolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "GetClientData",
	description: "This is get client data",
	fields: {
		clientId: {
			type: GraphQLString,
			description: "",
		},
		clientToken: {
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
