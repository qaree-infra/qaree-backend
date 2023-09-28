import OTPCode from "../../../models/otpcode.js";
import User from "../../../models/user.js";
import sendMail from "../../../utils/sendMail.js";

import { generateOTPCode, validateEmail } from "../../../utils/helper.js";

const resendValidingOTP = async (parent, { email }) => {
	try {
		if (!email) throw new Error("The email is required");

		if (!validateEmail(email)) throw new Error("Invalid email");

		const user = await User.findOne({ email });

		const randomOPT = Math.ceil(generateOTPCode());
		const resetUrl = ``;
		const emailResult = await sendMail(
			email,
			resetUrl,
			user.name,
			"reset password",
		);

		if (emailResult?.accepted[0] === email) {
			await OTPCode.deleteMany({
				type: "reset-password",
				userId: user._id,
			});

			await OTPCode.create({
				type: "reset-password",
				number: randomOPT.toString(),
				userId: user._id,
			});

			return {
				message: "The email has been send",
				success: true,
			};
		} else {
			throw new Error(
				"Sorry, an unexpected thing happened while sending a OPT email, please try again",
			);
		}
	} catch (error) {
		throw new Error(error);
	}
};

export default resendValidingOTP;
