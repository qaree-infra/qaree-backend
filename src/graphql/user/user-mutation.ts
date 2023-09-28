import signupMutation from "./signup/signup-mutation.js";
import VerifyAccountMutation from "./verify-account/mutation.js";
import resendValidatingOTPMutation from "./resendValidatingOTP/mutation.js";
import signinMutation from "./signin/mutation.js";
import forgetPasswordMutation from "./forgetPassword/mutation.js";
import validateResetPasswordOTPMutation from "./validateResetPasswordOTP/mutation.js";

const UserMutation = {
	signup: signupMutation,
	verifyAccount: VerifyAccountMutation,
	resendValidatingOTP: resendValidatingOTPMutation,
	signin: signinMutation,
	forgetPassword: forgetPasswordMutation,
	validateResetPasswordOTP: validateResetPasswordOTPMutation,
};

export default UserMutation;
