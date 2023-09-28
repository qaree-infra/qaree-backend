import OTPCode from "../../../models/otpcode.js";
import User from "../../../models/user.js";
import sendMail from "../../../utils/sendMail.js";

import { generateOTPCode } from "../../../utils/helper.js";

const resendValidingOTP = async (parent, { email }) => {
	try {
		// todo: validate the email

		const user = await User.findOne({ email });

		if (user.valid) throw new Error("Your account has been already valid");

		const randomOPT = Math.ceil(generateOTPCode());
		const resetUrl = ``;
		const emailResult = await sendMail(
			email,
			resetUrl,
			user.name,
			"validate your account",
		);

		if (emailResult?.accepted[0] === email) {
			await OTPCode.create({
				type: "verify-account",
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
