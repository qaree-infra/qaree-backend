import OTPCode from "../../../models/otpcode.js";
import User from "../../../models/user.js";

const verifyAccount = async (parent, { otp, email }) => {
	try {
		const user = await User.findOne({ email });

		if (!user) throw new Error("User not found.");

		if (user.valid) throw new Error("Your account has been already valid");

		const otpCode = await OTPCode.findOne({
			userId: user._id,
			number: otp,
			type: "verify-account",
		});

		if (!otpCode) throw new Error("Sorry, invalid otp code");

		await OTPCode.deleteOne({ _id: otpCode._id });
		await User.findByIdAndUpdate(user._id, { valid: true }, { new: true });

		return {
			message: "Congratulations, your account has been verified",
			success: true,
		};
	} catch (error) {
		throw new Error(error);
	}
};

export default verifyAccount;
