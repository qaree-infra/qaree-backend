import { auth } from "../../../../middleware/general/auth.js";
import { validateEmail } from "../../../../utils/helper.js";
import Admin from "../../../../models/admin.js";
import bcrypt from "bcrypt";

const updateAccountResolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;

		if (auth?.error) throw new Error(auth?.error);

		const { name, oldPassword, newPassword } = args;

		const oldUser = await Admin.findById(auth.admin._id);

		if (!name && !oldPassword && !newPassword)
			throw new Error(
				lang === "ar"
					? "من فضلك ادخل البيانات الجديدة"
					: "Please enter the new data",
			);

		if (!oldUser)
			throw new Error(
				lang === "ar" ? "هذا المستخدم غير موجود" : "User not found",
			);

		let newUser = oldUser;

		if (newPassword) {
			const isPasswordCorrect = await bcrypt.compare(
				oldPassword,
				oldUser.password,
			);

			if (!isPasswordCorrect)
				throw new Error(
					lang === "ar"
						? "كلمة المرور القديمة غير متطابقة"
						: "The old password does not match.",
				);

			if (newPassword.length < 8) {
				throw new Error(
					lang === "ar"
						? "يجب أن تكون كلمة المرور مكونة من 8 أحرف وأرقام على الأقل"
						: "The password must be at least 8 letters and numbers",
				);
			}

			const passwordHash = await bcrypt.hash(newPassword, 12);
			newUser = Object.assign(oldUser, {
				name,
				password: passwordHash,
			});
		} else {
			newUser = Object.assign(oldUser, { name });
		}

		const afterUpdate = await Admin.findByIdAndUpdate(
			oldUser._id.toString(),
			newUser,
			{
				new: true,
			},
		).select("-password");

		return afterUpdate;
	} catch (error) {
		throw new Error(error);
	}
};

export default updateAccountResolve;
