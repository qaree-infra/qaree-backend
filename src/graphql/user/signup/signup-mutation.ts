import { GraphQLString, GraphQLObjectType } from "graphql";
import signupInputs from "./signup-input.js";
import signUpResolve from "./signup-resolver.js";

const signupType = new GraphQLObjectType({
	name: "SignUp",
	description: "sign up type",
	fields: {
		message: {
			type: GraphQLString,
		},
	},
});

export default {
	type: signupType,
	args: {
		userData: {
			type: signupInputs,
		},
		lang: {
			type: GraphQLString,
		},
	},
	resolve: signUpResolve,
};
