import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from "graphql";
import resolve from "./resolve.js";

const reviewBook = new GraphQLObjectType({
	name: "AdminBookReview",
	description: "admin book review type",
	fields: {
		message: {
			type: GraphQLString,
			description: "",
		},
		success: {
			type: GraphQLBoolean,
			description: "",
		},
	},
});

export default {
	type: reviewBook,
  args: {
    bookId: {
      type: GraphQLString,
      description: "",
    },
    status: {
      type: GraphQLString,
      description: "",
    },
    content: {
      type: GraphQLString,
      description: "",
    },
  },
  resolve: resolve
};
