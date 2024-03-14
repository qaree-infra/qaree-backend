import {
	GraphQLInt,
	GraphQLList,
	GraphQLString,
	GraphQLObjectType,
} from "graphql";
import book from "../../../types/book-type.js";
import getMyBooksResolve from "./resolve.js";

const booksArgs = {
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
	type: new GraphQLObjectType({
		name: "GetMyBooks",
		description: "This is the user books type",
		fields: {
			books: {
				type: new GraphQLList(book),
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
	}),
	args: booksArgs,
	description: "get user books",
	resolve: getMyBooksResolve,
};
