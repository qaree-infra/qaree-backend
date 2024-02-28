import {
	GraphQLFloat,
	GraphQLID,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";
import reviewBookResolve from "./resolve.js";
import reviewBookType from "../../../types/reviewBook-type.js";

const reviewBookResponseType = new GraphQLObjectType({
	name: "ReviewBookResponseType",
	description: "this is review book response type",
	fields: {
		message: {
			type: GraphQLString,
			description: "",
		},
		review: {
			type: reviewBookType,
			description: "",
		},
	},
});

export default {
	type: reviewBookResponseType,
	args: {
		bookId: {
			type: GraphQLID,
			description: "",
		},
		content: {
			type: GraphQLString,
			description: "",
		},
		rate: {
			type: GraphQLFloat,
			description: "",
		},
	},
	resolve: reviewBookResolve,
};
