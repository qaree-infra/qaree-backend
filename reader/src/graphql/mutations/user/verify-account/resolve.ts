import OTPCode from "../../../../models/otpcode.js";
import User from "../../../../models/user.js";
import { validateEmail } from "../../../../utils/helper.js";

const verifyAccount = async (parent, { otp, email }, context) => {
	const { lang } = context.query;
	try {
		if (!email && !otp)
			throw new Error(
				lang === "ar"
					? "الوسائط غير صالحة، يرجى إدخال البيانات المطلوبة."
					: "Invalid arguments, please enter the required data.",
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

		if (user?.valid)
			throw new Error(
				lang === "ar"
					? "هذا الحساب تم توثيقه من قبل"
					: "Your account has been already valid",
			);

		const otpCode = await OTPCode.findOne({
			userId: user._id,
			number: otp,
			type: "verify-account",
		});

		if (!otpCode)
			throw new Error(
				lang === "ar" ? "اسف هذا الكود غير صالح" : "Sorry, invalid otp code",
			);

		await OTPCode.deleteOne({ _id: otpCode._id });
		await User.findByIdAndUpdate(user._id, { valid: true }, { new: true });

		return {
			message:
				lang === "ar"
					? "تهانينا تم توثيق الحساب"
					: "Congratulations, your account has been verified",
			success: true,
		};
	} catch (error) {
		throw new Error(error);
	}
};

export default verifyAccount;
