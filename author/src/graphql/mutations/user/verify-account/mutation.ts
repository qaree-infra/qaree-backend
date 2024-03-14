import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
import verifyAccountResolve from "./resolve.js";
import verifyAccountInput from "./verify-input.js";

const verifyAccountType = new GraphQLObjectType({
	name: "VerifyAccountType",
	description: "verify account type",
	fields: {
		message: {
			type: GraphQLString,
		},
		success: {
			type: GraphQLBoolean,
		},
	},
});

export default {
	type: verifyAccountType,
	args:  verifyAccountInput,
	resolve: verifyAccountResolve,
};
