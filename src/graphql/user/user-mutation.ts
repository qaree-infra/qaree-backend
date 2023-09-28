import signupMutation from "./signup/signup-mutation.js";
import VerifyAccountMutation from './verify-account/mutation.js'

const UserMutation = {
	signup: signupMutation,
	verifyAccount: VerifyAccountMutation
};

export default UserMutation;
