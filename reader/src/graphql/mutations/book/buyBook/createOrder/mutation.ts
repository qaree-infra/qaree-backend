import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import resolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "CreatePaymentOrder",
	description: "This is create buy book order payment",
	fields: {
		id: {
			type: GraphQLString,
			description: "",
		},
		status: {
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
