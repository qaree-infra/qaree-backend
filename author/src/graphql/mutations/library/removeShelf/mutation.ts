import { GraphQLObjectType, GraphQLString } from "graphql";
import resolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "RemoveShelfType",
	description: "This is remove shelf type",
	fields: {
		success: {
			type: GraphQLString,
			description: "",
		},
		message: {
			type: GraphQLString,
			description: "",
		},
	},
});

const args = {
	shelf: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type,
	args,
	resolve,
};
