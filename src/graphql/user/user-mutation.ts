import signupMutation from "./signup/signup-mutation.js";
import VerifyAccountMutation from "./verify-account/mutation.js";
import resendValidatingOTPMutation from "./resendValidatingOTP/mutation.js";
import signinMutation from "./signin/mutation.js";

const UserMutation = {
	signup: signupMutation,
	verifyAccount: VerifyAccountMutation,
	resendValidatingOTP: resendValidatingOTPMutation,
	signin: signinMutation
};

export default UserMutation;
