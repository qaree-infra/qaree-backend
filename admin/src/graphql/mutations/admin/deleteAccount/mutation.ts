import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from "graphql";
import deleteAccountResolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "DeleteAccount",
	description: "This is admin delete account type",
	fields: {
		message: {
			type: GraphQLString,
			description: "",
		},
		deleted_id: {
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
	type,
	resolve: deleteAccountResolve,
};
