import { GraphQLString } from "graphql";

const resetPasswordInputs = {
	newPassword: {
		type: GraphQLString,
		description: "",
	},
};

export default resetPasswordInputs;
