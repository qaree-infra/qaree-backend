import User from "../../../models/user.js";
import OTPCode from "../../../models/otpcode.js";
import ResetId from "../../../models/resetId.js";
import {
	validateEmail,
	createPasswordResetToken,
} from "../../../utils/helper.js";

const validateResetPasswordOTP = async (parent, { otp, email }, context) => {
	const { lang } = context.query;
	try {
		if (!email && !otp)
			throw new Error(
				lang === "ar"
					? "الوسائط غير صالحة، يرجى إدخال البيانات المطلوبة."
					: "Invalid arguments, please enter the required data."
			);

		if (!email)
			throw new Error(
				lang === "ar" ? "البريد الإلكتروني مطلوب" : "The email is required",
			);

		if (!otp)
			throw new Error(lang === "ar" ? "الكود مطلوب" : "The otp is required");

		if (!validateEmail(email))
			throw new Error(lang === "ar" ? "بريد إلكتروني خاطئ" : "Invalid email");

		if (Number.isNaN(Number(otp)))
			throw new Error(
				lang === "ar" ? "كلمة مرور لمرة واحدة غير صالحة" : "Invalid otp",
			);

		const user = await User.findOne({ email });

		if (!user)
			throw new Error(
				lang === "ar" ? "هذا المستخدم غير موجود" : "User not found.",
			);

		const otpCode = await OTPCode.findOne({
			userId: user._id,
			number: otp,
			type: "reset-password",
		});

		if (!otpCode)
			throw new Error(
				lang === "ar" ? "اسف هذا الكود غير صالح" : "Sorry, invalid otp code",
			);

		await OTPCode.deleteOne({ _id: otpCode._id });

		const token = createPasswordResetToken({ id: user._id }).split(".");

		const createdToken = await ResetId.create({
			partOne: token[0],
			partTwo: token[1],
			partThree: token[2],
		});

		return {
			message:
				lang === "ar"
					? "لقد نجح OTP الخاص بك في إعادة تعيين كلمة المرور"
					: "Your OTP is successful for resetting the password",
			success: true,
			reset_token: createdToken.partThree,
		};
	} catch (error) {
		throw new Error(error);
	}
};

export default validateResetPasswordOTP;
