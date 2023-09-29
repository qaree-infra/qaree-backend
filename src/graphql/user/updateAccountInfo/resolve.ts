import bcrypt from "bcrypt";

import authMiddleware, { AuthInterface } from "../../middleware/auth.js";
import User from "../../../models/user.js";

const updateAccountInfo = async (
	_,
	{ name, oldPassword, newPassword },
	context,
) => {
	try {
		const auth: AuthInterface = await authMiddleware(context);

		if (auth?.error) {
			throw new Error(auth?.error);
		} else {
			const oldUser = await User.findById(auth.user._id);

			if (!name && !oldPassword && !newPassword)
				throw new Error("Please enter the new data");

			if (!oldUser) throw new Error("User not found");

			let newUser = oldUser;

			if (newPassword) {
				const isPasswordCorrect = await bcrypt.compare(
					oldPassword,
					oldUser.password,
				);

				if (!isPasswordCorrect)
					throw new Error("The old password does not match.");

				if (newPassword.length < 8) {
					throw new Error(
						"The password shouldn't be less than 8 letter or numbers",
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

			const afterUpdate = await User.findByIdAndUpdate(
				oldUser._id.toString(),
				newUser,
				{
					new: true,
				},
			).select("-password");

			return afterUpdate;
		}
	} catch (error) {
		throw new Error(error);
	}
};

export default updateAccountInfo;
