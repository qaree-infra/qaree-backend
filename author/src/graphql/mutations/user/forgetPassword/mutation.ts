import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
import forgetPasswordResolve from "./resolve.js";
import forgetPasswordInputs from "./args.js";

const forgetPasswordType = new GraphQLObjectType({
	name: "ForgetPasswordType",
	description: "forgetPassword type",
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
	type: forgetPasswordType,
	args: forgetPasswordInputs,
	resolve: forgetPasswordResolve,
};
