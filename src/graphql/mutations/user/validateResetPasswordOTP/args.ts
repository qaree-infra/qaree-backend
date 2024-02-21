import { GraphQLString } from "graphql";

const validateResetPasswordInputs = {
	email: {
		type: GraphQLString,
		description: "",
	},
	otp: {
		type: GraphQLString,
		description: "",
	}
};

export default validateResetPasswordInputs;
