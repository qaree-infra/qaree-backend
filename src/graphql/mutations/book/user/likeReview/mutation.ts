import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
import resolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "LikeReview",
	description: "this like review mutation type",
	fields: {
		success: {
			type: GraphQLBoolean,
			description: "",
		},
		message: {
			type: GraphQLString,
			description: "",
		},
	},
});

const args = {
	reviewId: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type,
	args,
	resolve,
};
