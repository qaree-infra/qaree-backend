import {
	GraphQLObjectType,
	GraphQLList,
	GraphQLInt,
	GraphQLString,
} from "graphql";
import bookInfoType from "../../../types/book-type.js";
import getBooksResolve from "./resolve.js";

const getBooksType = new GraphQLObjectType({
	name: "GetBooks",
	description: "This is the user books type",
	fields: {
		books: {
			type: new GraphQLList(bookInfoType),
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
	args: {
		category: {
			type: GraphQLString,
			description: "",
		},
		sort: {
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
		}
	},
	resolve: getBooksResolve,
};
