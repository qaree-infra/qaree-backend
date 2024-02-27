import bcrypt from "bcrypt";
import User from "../../../../models/user.js";
import { validateEmail, createAcessToken } from "../../../../utils/helper.js";

const signIn = async (parent, args, context) => {
	const { lang } = context.query;
	try {
		const { email, password } = args;

		if (!email && !password)
			throw new Error(
				lang === "ar"
					? "الوسائط غير صالحة، يرجى إدخال البيانات المطلوبة."
					: "Invalid arguments, please enter the required data.",
			);

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

		const existingUser = await User.findOne({ email });

		if (!existingUser)
			throw new Error(
				lang === "ar" ? "هذا المستخدم غير موجود" : "User not found.",
			);

		if (!existingUser.valid)
			throw new Error(lang === "ar" ? "مستخدم غير صالح" : "Invalid user");

		const isPasswordCorrect = await bcrypt.compare(
			password,
			existingUser.password,
		);
		if (!isPasswordCorrect)
			throw new Error(lang === "ar" ? "هذا الباسورد خظأ" : "wrong password");

		const token = createAcessToken({
			email: existingUser.email,
			id: existingUser._id,
		});

		return {
			access_token: token,
			message: lang === "ar" ? "تسجيل دخول ناجح" : "Successful login",
		};
	} catch (error) {
		throw new Error(error);
	}
};

export default signIn;
