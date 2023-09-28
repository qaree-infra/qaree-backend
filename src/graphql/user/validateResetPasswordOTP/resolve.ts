import User from "../../../models/user.js";
import OTPCode from "../../../models/otpcode.js";
import { validateEmail } from "../../../utils/helper.js";

const validateResetPasswordOTP = async (parent, { otp, email }) => {
	try {
		if (!email && !otp)
			throw new Error("Invalid arguments, please enter the required data.");

		if (!email) throw new Error("The email is required");
		if (!otp) throw new Error("The otp is required");

		if (!validateEmail(email)) throw new Error("Invalid email");
		if (Number.isNaN(Number(otp))) throw new Error("Invalid otp");

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
};

export default validateResetPasswordOTP;
