import { auth } from "../../../../middleware/general/auth.js";
import { validateEmail } from "../../../../utils/helper.js";
import Admin, { AdminInterface } from "../../../../models/admin.js";
import bcrypt from "bcrypt";

const registerResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { name, email, password } = args;

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

		const oldUser: AdminInterface = await Admin.findOne({ email });
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
		const addedUser: AdminInterface = await Admin.create(newUser);

		return addedUser;
	} catch (error) {
		throw new Error(error);
	}
};

export default registerResolve;
