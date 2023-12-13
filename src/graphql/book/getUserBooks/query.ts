import { GraphQLInt, GraphQLList, GraphQLString } from "graphql";
import myBook from "../myBook-type.js";
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
  }
};

export default {
	type: {
		books: new GraphQLList(myBook),
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
	args: userBooksArgs,
	resolve: getUserBooksResolve,
};
