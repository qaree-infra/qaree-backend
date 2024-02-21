import {
	GraphQLInt,
	GraphQLList,
	GraphQLString,
	GraphQLObjectType,
} from "graphql";
import myBook from '../../../../types/myBook-type.js';
import getUserBooksResolve from "./resolve.js";

const userBooksArgs = {
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
		name: "GetUserBooks",
		description: "This is the user books type",
		fields: {
			books: {
				type: new GraphQLList(myBook),
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
	args: userBooksArgs,
	description: "get user books",
	resolve: getUserBooksResolve,
};
