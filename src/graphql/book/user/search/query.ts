import {
	GraphQLList,
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
} from "graphql";

import bookInfoType from "../../book-type.js";
import resolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "SearchType",
	description: "This is the search books type",
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
	type,
	args: {
		categories: {
			type: GraphQLList(GraphQLString),
			description: "",
		},
		keyword: {
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
		},
	},
	resolve,
};
