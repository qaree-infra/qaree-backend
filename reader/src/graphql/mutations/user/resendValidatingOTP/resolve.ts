import OTPCode from "../../../../models/otpcode.js";
import User from "../../../../models/user.js";
import sendMail, { generateNumberMail } from "../../../../utils/sendMail.js";

import { generateOTPCode, validateEmail } from "../../../../utils/helper.js";

const resendValidingOTP = async (parent, { email }, context) => {
	const { lang } = context.query;
	try {
		if (!email)
			throw new Error(
				lang === "ar" ? "البريد الإلكتروني مطلوب" : "The email is required",
			);

		if (!validateEmail(email))
			throw new Error(lang === "ar" ? "بريد إلكتروني خاطئ" : "Invalid email");

		const user = await User.findOne({ email });

		if (user.valid)
			throw new Error(
				lang === "ar"
					? "هذا الحساب تم توثيقه من قبل"
					: "Your account has been already valid",
			);

		const randomOPT = Math.ceil(generateOTPCode());

		const mail = await generateNumberMail(
			"validate",
			randomOPT.toString(),
			user.name,
		);
		const emailResult = await sendMail(email, mail);

		if (emailResult?.accepted[0] === email) {
			await OTPCode.create({
				type: "verify-account",
				number: randomOPT.toString(),
				userId: user._id,
			});

			return {
				message:
					lang === "ar"
						? "تم ارسال البريد الالكترونى"
						: "The email has been send",
				success: true,
			};
		} else {
			throw new Error(
				lang === "ar"
					? "ناسف لقد حدث خطأ غير متوقع اثناء ارسال البريد الالكترونى حاول لاحقاً"
					: "Sorry, an unexpected thing happened while sending a OPT email, please try again",
			);
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export default resendValidingOTP;
