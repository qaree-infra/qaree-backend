import { GraphQLString } from "graphql";

const resendResetPasswordOTPInputs = {
	email: {
		type: GraphQLString,
		description: "",
	},
};

export default resendResetPasswordOTPInputs;
