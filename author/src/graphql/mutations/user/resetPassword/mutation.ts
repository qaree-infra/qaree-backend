import { GraphQLObjectType, GraphQLString } from "graphql";
import resetPassword from "./resolve.js";
import resetPasswordInputs from "./args.js";

const resetPasswordType = new GraphQLObjectType({
	name: "ResetPassword",
	description: "reset password type",
	fields: {
		message: {
			type: GraphQLString,
		},
	},
});

export default {
  type: resetPasswordType,
  args: resetPasswordInputs,
  resolve: resetPassword,
}
