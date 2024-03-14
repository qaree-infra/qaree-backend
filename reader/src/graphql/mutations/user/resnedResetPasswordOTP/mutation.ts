import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
import resendResetPasswordOTPResolve from "./resolve.js";
import ResendResetPasswordOTPInputs from "./args.js";

const resendResetPasswordOTPType = new GraphQLObjectType({
	name: "ResendResetPasswordOTPType",
	description: "resend reset password otp type",
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
	type: resendResetPasswordOTPType,
	args: ResendResetPasswordOTPInputs,
	resolve: resendResetPasswordOTPResolve,
};
