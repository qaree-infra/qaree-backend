import { GraphQLList, GraphQLObjectType, GraphQLInt, GraphQLString } from "graphql";
import resolve from "./resolve.js";
import { reviewBookType } from "../reviewBook/mutation.js";

const type = new GraphQLObjectType({
	name: "GetBookReviews",
	description: "this is book reviews type",
	fields: {
		reviews: {
			type: new GraphQLList(reviewBookType),
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
  bookId: {
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
};

export default {
	type,
	args,
	resolve,
};
