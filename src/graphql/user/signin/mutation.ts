import { GraphQLObjectType, GraphQLString } from "graphql";
import resendValidingOTP from "./resolve.js";
import SigninArgs from "./args.js";

const signinType = new GraphQLObjectType({
	name: "SigninType",
	description: "signin type",
	fields: {
		message: {
			type: GraphQLString,
		},
		access_token: {
      type: GraphQLString,
		},
	},
});

export default {
	type: signinType,
	args: SigninArgs,
	resolve: resendValidingOTP,
};
