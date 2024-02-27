import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from "graphql";
import shelfType from "../../../types/shelf-type.js";
import resolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "RemoveBookFromShelf",
	description: "This is remove book from shelf type",
	fields: {
		shelf: {
			type: shelfType,
			description: "",
		},
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
