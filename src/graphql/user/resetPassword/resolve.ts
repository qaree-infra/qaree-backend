import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import ResetId from "../../../models/resetId.js";
import User from "../../../models/user.js";

function convertArrayToObject(arr: string[]): object {
	const result = {};

	for (let i = 0; i < arr.length; i += 2) {
		const key = arr[i];
		const value = arr[i + 1];

		result[key] = value;
	}

	return result;
}

const resetPassword = async (_, { oldPassword, newPassword }, context) => {
	const { lang } = context.query;
	const headers = convertArrayToObject(context.rawHeaders);
	let token;

	try {
		token = headers?.["Authorization"]?.split(" ")[1];

		if (!token)
			throw new Error(
				lang === "ar"
					? "رمز إعادة التعيين مطلوب"
					: "the reset token is required",
			);

		const tokenData = await ResetId.findOne({ partThree: token });

		if (!tokenData)
			throw new Error(
				lang === "ar"
					? "لقد انتهت صلاحية الرمز المميز، يرجى محاولة تعيين كلمة المرور مرة أخرى."
					: "Expired token, please try set password again.",
			);

		const realToken =
			tokenData.partOne + "." + tokenData.partTwo + "." + tokenData.partThree;

		const isCustomAuth = realToken.length < 500;

		let decodedData, userId;

		if (realToken && isCustomAuth) {
			decodedData = jwt.verify(realToken, process.env.RESET_TOKEN_SECRET);

			userId = decodedData?.id;
		} else {
			decodedData = jwt.decode(realToken);

			userId = decodedData?.sub;
		}

		if (!oldPassword && !newPassword)
			throw new Error(
				lang === "ar"
					? "الوسائط غير صالحة، يرجى إدخال البيانات المطلوبة."
					: "Invalid arguments, please enter the required data.",
			);

		if (!newPassword)
			throw new Error(
				lang === "ar"
					? "كلمة المرور الجديدة مطلوبة"
					: "The new password is required",
			);

		if (!oldPassword)
			throw new Error(
				lang === "ar"
					? "كلمة المرور القديمة مطلوبة"
					: "The old password is required",
			);

		const user = await User.findById(userId);

		if (!user)
			throw new Error(
				lang === "ar" ? "هذا المستخدم غير موجود" : "User not found.",
			);

		const hashedPassword = await bcrypt.hash(newPassword, 12);

		await User.findOneAndUpdate(
			{ _id: user._id },
			{
				password: hashedPassword,
			},
		);

		await ResetId.deleteOne({ _id: tokenData._id });

		return {
			message:
				lang === "ar"
					? "تم تغير كلمة المرور بنجاح"
					: "Your password has been reseted successfully.",
			success: true,
		};
	} catch (error) {
		throw new Error(error);
	}
};

export default resetPassword;
