import User from "../../../models/user.js";
import OTPCode from "../../../models/otpcode.js";

const validateResetPasswordOTP = async (parent, {otp, email}) => {
  try {
    const user = await User.findOne({ email });

		if (!user) throw new Error("User not found.");

		const otpCode = await OTPCode.findOne({
			userId: user._id,
			number: otp,
			type: "reset-password",
		});

		if (!otpCode) throw new Error("Sorry, invalid otp code");

		await OTPCode.deleteOne({ _id: otpCode._id });

		return {
			message: "Your OTP is successful for reset password",
			success: true,
		};
  } catch (error) {
    throw new Error(error);
  }
}

export default validateResetPasswordOTP;
