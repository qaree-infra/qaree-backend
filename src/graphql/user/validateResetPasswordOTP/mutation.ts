import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
import verifyAccountResolve from "./resolve.js";
import validateResetPasswordInputs from "./args.js";

const validateResetPasswordType = new GraphQLObjectType({
	name: "ValidateResetPasswordType",
	description: "validate reset password type",
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
	type: validateResetPasswordType,
	args:  validateResetPasswordInputs,
	resolve: verifyAccountResolve,
};
