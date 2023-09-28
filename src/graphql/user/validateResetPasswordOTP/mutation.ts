import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
import validateResetPasswordResolve from "./resolve.js";
import validateResetPasswordInputs from "./args.js";

const validateResetPasswordType = new GraphQLObjectType({
	name: "ValidateResetPasswordType",
	description: "validate reset password type",
	fields: {
		message: {
			type: GraphQLString,
		},
		reset_token: {
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
	resolve: validateResetPasswordResolve,
};
