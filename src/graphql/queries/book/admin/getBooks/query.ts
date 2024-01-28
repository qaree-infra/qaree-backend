import {
	GraphQLInt,
	GraphQLList,
	GraphQLString,
	GraphQLObjectType,
} from "graphql";
import getUserBooksResolve from "./resolve.js";
import adminBookType from "../../../../types/adminBook-type.js";

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

const getBooksType = new GraphQLObjectType({
	name: "AdminGetBooks",
	description: "This is the user books type",
	fields: {
		books: {
			type: new GraphQLList(adminBookType),
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

export default {
	type: getBooksType,
	args: booksArgs,
	description: "get user books",
	resolve: getUserBooksResolve,
};
