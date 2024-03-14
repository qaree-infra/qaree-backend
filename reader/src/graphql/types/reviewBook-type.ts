import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLList,
	GraphQLFloat,
} from "graphql";
import { authorType } from "./myBook-type.js";

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

export default reviewBookType;
