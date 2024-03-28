import { GraphQLInt, GraphQLString, GraphQLObjectType, GraphQLFloat } from "graphql";
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
			type: GraphQLFloat,
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
