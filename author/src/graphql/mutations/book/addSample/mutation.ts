import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import resolve from "./resolve.js";
import bookType from "../../../types/book-type.js";

const type = new GraphQLObjectType({
	name: "AddBookSample",
	description: "This is add book sample",
	fields: {
		message: {
			type: GraphQLString,
			description: "",
		},
    book: {
      type: bookType,
      description: "",
    }
	},
});

const args = {
	bookId: {
		type: GraphQLString,
		description: "",
	},
	sample: {
		type: new GraphQLList(GraphQLString),
		description: "",
	},
};

export default {
	type,
	args,
	resolve,
};
