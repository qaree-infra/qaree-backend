import User from "../../../models/user.js";
import OPTCode from "../../../models/otpcode.js";
import bcrypt from "bcrypt";

import { validateEmail } from "../../../utils/helper.js";
import sendMail from "../../../utils/sendMail.js";

const signUpResolve = async (parent, { userData }) => {
	try {
		const { name, email, password } = userData;
		if (!name && !email && !password)
			throw new Error("Invalid arguments, please enter the required data.");

		if (!name) throw new Error("The name is required");
		if (!email) throw new Error("The email is required");
		if (!password) throw new Error("The password is required");

		if (!validateEmail(email)) throw new Error("Invalid email");

		const oldUser = await User.findOne({ email });
		if (oldUser) throw new Error("This email already exists");

		if (password.length < 8)
			throw new Error("The password must be at least 8 letters and numbers");

		const hashedPassword = await bcrypt.hash(password, 12);

		const newUser = { email, password: hashedPassword, name };
		const addedUser = await User.create(newUser);

		// send email with random number
		const randomOPT = Math.ceil(Math.random() * 1000000);
		const resetUrl = ``;
		const emailResult = await sendMail(
			email,
			resetUrl,
			name,
			"validate your account",
		);

		if (emailResult?.accepted[0] === email) {
			await OPTCode.create({
				type: "verify-account",
				number: randomOPT.toString(),
				userId: addedUser._id,
			});

			return {
				message: "Successfuly signup, please verify your account",
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

export default signUpResolve;
