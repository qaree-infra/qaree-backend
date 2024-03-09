import User from "../../../../models/user.js";
import { auth } from "../../../../middleware/general/auth.js";
import {
	getFullStatus,
	trackOnboardingStatus,
} from "../../../../utils/paypal-api.js";

const resolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;
		if (auth?.error) throw new Error(auth?.error);

		if (auth.user.merchantId) {
			const merchantStatusData = await getFullStatus(auth.user?.merchantId);

			return merchantStatusData;
		} else {
			const statusData = await trackOnboardingStatus(auth.user._id);

			await User.findByIdAndUpdate(
				auth.user._id,
				{ merchantId: statusData.merchant_id },
				{ new: true },
			);

			const merchantStatusData = await getFullStatus(statusData.merchant_id);

			return merchantStatusData;
		}
	} catch (error) {
		throw new Error(error?.message || error);
	}
};

export default resolve;
