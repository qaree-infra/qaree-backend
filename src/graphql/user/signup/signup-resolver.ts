import User from "../../../models/user.js";
import OTPCode from "../../../models/otpcode.js";
import bcrypt from "bcrypt";

import { validateEmail, generateOTPCode } from "../../../utils/helper.js";
import sendMail from "../../../utils/sendMail.js";

const signUpResolve = async (parent, { userData, lang }) => {
	try {
		const { name, email, password } = userData;
		if (!name && !email && !password)
			throw new Error(
				lang === "ar"
					? "الوسائط غير صالحة، يرجى إدخال البيانات المطلوبة."
					: "Invalid arguments, please enter the required data.",
			);

		if (!name)
			throw new Error(lang === "ar" ? "الاسم مطلوب" : "The name is required");

		if (!email)
			throw new Error(
				lang === "ar" ? "البريد الإلكتروني مطلوب" : "The email is required",
			);

		if (!password)
			throw new Error(
				lang === "ar" ? "كلمة المرور مطلوبة" : "The password is required",
			);

		if (!validateEmail(email))
			throw new Error(lang === "ar" ? "بريد إلكتروني خاطئ" : "Invalid email");

		const oldUser = await User.findOne({ email });
		if (oldUser)
			throw new Error(
				lang === "ar"
					? "هذا البريد الإلكتروني موجود بالفعل"
					: "This email already exists",
			);

		if (password.length < 8)
			throw new Error(
				lang === "ar"
					? "يجب أن تكون كلمة المرور مكونة من 8 أحرف وأرقام على الأقل"
					: "The password must be at least 8 letters and numbers",
			);

		const hashedPassword = await bcrypt.hash(password, 12);

		const newUser = { email, password: hashedPassword, name };
		const addedUser = await User.create(newUser);

		// send email with random number
		const randomOPT = Math.ceil(generateOTPCode());
		const emailResult = await sendMail(
			email,
			randomOPT.toString(),
			name,
			"validate",
		);

		if (emailResult?.accepted[0] === email) {
			await OTPCode.create({
				type: "verify-account",
				number: randomOPT.toString(),
				userId: addedUser._id,
			});

			return {
				message:
					lang === "ar"
						? "تم التسجيل بنجاح، يرجى التحقق من حسابك"
						: "Successfully sign up, please verify your account",
				success: true,
			};
		} else {
			throw new Error(
				lang === "ar"
					? "عذرًا، حدث شيء غير متوقع أثناء إرسال بريد إلكتروني OPT، يرجى المحاولة مرة أخرى"
					: "Sorry, an unexpected thing happened while sending an OPT email, please try again",
			);
		}
	} catch (error) {
		throw new Error(error);
	}
};

export default signUpResolve;
