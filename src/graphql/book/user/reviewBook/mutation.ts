import {
	GraphQLFloat,
	GraphQLID,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";
import reviewBookResolve from "./resolve.js";

const reviewBookType = new GraphQLObjectType({
	name: "ReviewBook",
	description: "this is book review type",
	fields: {
		_id: {
			type: GraphQLID,
			description: "",
		},
		rate: {
			type: GraphQLFloat,
			description: "",
		},
		content: {
			type: GraphQLString,
			description: "",
		},
		user: {
			type: GraphQLString,
			description: "",
		},
		likes: {
			type: new GraphQLList(GraphQLString),
			description: "",
		},
	},
});

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
