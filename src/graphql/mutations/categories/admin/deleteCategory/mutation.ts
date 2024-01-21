import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
import deleteCategoryResolve from "./resolve.js";

const deleteCategoryType = new GraphQLObjectType({
	name: "DeleteCategoryType",
	description: "This is delete category type",
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

const args = {
	categoryId: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type: deleteCategoryType,
	args: args,
	resolve: deleteCategoryResolve,
};
