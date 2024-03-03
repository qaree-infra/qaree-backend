import { GraphQLInt, GraphQLString, GraphQLObjectType } from "graphql";
import bookInfoType from "../../../types/book-type.js";

const activity = new GraphQLObjectType({
	name: "Activity",
	description: "this is read activity",
	fields: {
		book: {
			type: bookInfoType,
			description: "",
		},
		status: {
			type: GraphQLString,
			description: "",
		},
		readingProgress: {
			type: GraphQLInt,
			description: "",
		},
		updatedAt: {
			type: GraphQLString,
		},
		createdAt: {
			type: GraphQLString,
		},
	},
});

export default activity;
