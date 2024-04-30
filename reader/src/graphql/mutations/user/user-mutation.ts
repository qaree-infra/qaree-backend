import signupMutation from "./signup/signup-mutation.js";
import VerifyAccountMutation from "./verify-account/mutation.js";
import resendValidatingOTPMutation from "./resendValidatingOTP/mutation.js";
import signinMutation from "./signin/mutation.js";
import forgetPasswordMutation from "./forgetPassword/mutation.js";
import validateResetPasswordOTPMutation from "./validateResetPasswordOTP/mutation.js";
import ResendResetPasswordOTPMutation from "./resnedResetPasswordOTP/mutation.js";
import ResetPasswordMutation from "./resetPassword/mutation.js";
import updateAccountMutation from "./updateAccountInfo/mutation.js";
import deleteAccountMutation from "./deleteUser/mutation.js";
import googleLoginMutation from "./googleLogin/mutation.js";
import followUserMutation from "./follow/mutation.js";

export default {
	signup: signupMutation,
	verifyAccount: VerifyAccountMutation,
	resendValidatingOTP: resendValidatingOTPMutation,
	signin: signinMutation,
	forgetPassword: forgetPasswordMutation,
	validateResetPasswordOTP: validateResetPasswordOTPMutation,
	resendResetPasswordOTP: ResendResetPasswordOTPMutation,
	resetPassword: ResetPasswordMutation,
	updateUser: updateAccountMutation,
	deleteAccount: deleteAccountMutation,
	googleLogin: googleLoginMutation,
	followUser: followUserMutation,
};
