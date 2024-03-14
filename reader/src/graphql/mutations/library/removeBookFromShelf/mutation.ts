import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from "graphql";
import resolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "RemoveBookFromShelf",
	description: "This is remove book from shelf type",
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
	bookId: {
		type: GraphQLString,
		description: "",
	},
	shelf: {
		/* shelfId or shelfName */
		type: GraphQLString,
		description: "",
	},
};

export default {
	type,
	args,
	resolve,
};
