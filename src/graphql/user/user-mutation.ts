import signupMutation from "./signup/signup-mutation.js";
import VerifyAccountMutation from "./verify-account/mutation.js";
import resendValidatingOTPMutation from "./resendValidatingOTP/mutation.js";
import signinMutation from "./signin/mutation.js";
import forgetPasswordMutation from "./forgetPassword/mutation.js";

const UserMutation = {
	signup: signupMutation,
	verifyAccount: VerifyAccountMutation,
	resendValidatingOTP: resendValidatingOTPMutation,
	signin: signinMutation,
	forgetPassword: forgetPasswordMutation
};

export default UserMutation;
