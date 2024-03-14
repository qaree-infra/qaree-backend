import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
import resendValidingOTP from "./resolve.js";
import ResendValidingOTPInputs from "./args.js";

const resendValidingOTPType = new GraphQLObjectType({
	name: "ResendValidatingOTPType",
	description: "resend validating otp type",
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
	type: resendValidingOTPType,
	args: ResendValidingOTPInputs,
	resolve: resendValidingOTP,
};
