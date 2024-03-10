import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
import resolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "AddBookShelf",
	description: "this add book shelf type",
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

export default {
	type: type,
	args: {
		bookId: {
			type: GraphQLString,
			description: "",
		},
		shelf: {
			/* shelfId or shelfName */
			type: GraphQLString,
			description: "",
		},
	},
	resolve,
};
