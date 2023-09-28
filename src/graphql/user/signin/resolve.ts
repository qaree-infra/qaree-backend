import bcrypt from "bcrypt";
import User from "../../../models/user.js";
import { validateEmail, createAcessToken } from "../../../utils/helper.js";

const signIn = async (parent, args) => {
	try {
		const { email, password } = args;

		if (!email && !password)
			throw new Error("Invalid arguments, please enter the required data.");

		if (!email) throw new Error("The email is required");
		if (!password) throw new Error("The password is required");

		if (!validateEmail(email)) throw new Error("Invalid email");

		const existingUser = await User.findOne({ email });

		if (!existingUser) throw Error("User not found");

		const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
		if (!isPasswordCorrect) throw new Error("wrong password");

		const token = createAcessToken({
			email: existingUser.email,
			id: existingUser._id,
		});

		return { access_token: token, message: "Successful login" };
	} catch (error) {
		throw new Error(error);
	}
};

export default signIn;
