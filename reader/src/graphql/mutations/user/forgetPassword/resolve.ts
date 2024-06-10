import User from "../../../../models/user.js";
import OTPCode from "../../../../models/otpcode.js";
import { validateEmail, generateOTPCode } from "../../../../utils/helper.js";
import sendMail, { generateNumberMail } from "../../../../utils/sendMail.js";

const forgetPassword = async (parent, { email }, context) => {
	const { lang } = context.query;
	try {
		if (!email)
			throw new Error(
				lang === "ar" ? "البريد الإلكتروني مطلوب" : "The email is required",
			);

		if (!validateEmail(email))
			throw new Error(lang === "ar" ? "بريد إلكتروني خاطئ" : "Invalid email");

		const user = await User.findOne({ email });

		if (!user)
			throw new Error(
				lang === "ar" ? "هذا المستخدم غير موجود" : "User not found.",
			);

		const randomOPT = Math.ceil(generateOTPCode());
		const mail = await generateNumberMail(
			"reset password",
			randomOPT.toString(),
			user.name,
		);
		const emailResult = await sendMail(email, mail);

		if (emailResult?.accepted[0] === email) {
			await OTPCode.create({
				type: "reset-password",
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
		throw new Error(error);
	}
};

export default forgetPassword;
