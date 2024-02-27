import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from "graphql";
import deleteAccountResolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "AdminDeleteAccount",
	description: "This is admin delet account type",
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
