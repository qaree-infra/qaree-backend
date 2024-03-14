import {
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";
import resolve from "./resolve.js";
import bookType from "../../../types/book-type.js";

const type = new GraphQLObjectType({
	name: "GetBooksFromRecyclePinType",
	description: "this is type of get books from recycle pin type",
	fields: {
		books: {
			type: new GraphQLList(bookType),
			description: "",
		},
		currentPage: {
			type: GraphQLInt,
			description: "",
		},
		numberOfPages: {
			type: GraphQLInt,
			description: "",
		},
		total: {
			type: GraphQLInt,
			description: "",
		},
	},
});

const args = {
	sortBy: {
		type: GraphQLString,
		description: "",
	},
	filterBy: {
		type: GraphQLString,
		description: "",
	},
	page: {
		type: GraphQLInt,
		description: "",
	},
	limit: {
		type: GraphQLInt,
		description: "",
	},
	keyword: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type,
	args,
	resolve,
};
