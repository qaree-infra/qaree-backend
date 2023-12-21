import {
	GraphQLFloat,
	GraphQLID,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";
import reviewBookResolve from "./resolve.js";
import { authorType } from "../../myBook-type.js";

export const reviewBookType = new GraphQLObjectType({
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
			type: authorType,
			description: "",
		},
		bookId: {
			type: GraphQLString,
			description: "",
		},
		likes: {
			type: new GraphQLList(GraphQLString),
			description: "",
		},
		createdAt: {
			type: GraphQLString,
			description: "",
		},
		updatedAt: {
			type: GraphQLString,
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
