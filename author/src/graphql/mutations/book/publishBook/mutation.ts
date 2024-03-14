import { GraphQLObjectType, GraphQLString } from "graphql";
import book from "../../../types/book-type.js";
import publishBookResolve from "./resolve.js";

const publishBookToType = new GraphQLObjectType({
	name: "PublishBook",
	description: "this is the publish book type",
	fields: {
		message: {
			type: GraphQLString,
			description: "",
		},
		book: {
			type: book,
			description: "",
		},
	},
});

export default {
	type: publishBookToType,
	args: {
		bookId: {
			type: GraphQLString,
			description: "",
		},
	},
	resolve: publishBookResolve,
};
