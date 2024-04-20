import { auth } from "../../../../middleware/general/auth.js";
import { trackOnboardingStatus } from "../../../../utils/paypal-api.js";
import User from "../../../../models/user.js";

const resolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const { trackingId } = args;

		if (!trackingId) throw new Error("enter the tracking id");

		const auth: auth = context.auth;
		if (auth.error) throw new Error(auth.error);

		if (trackingId !== auth.user._id.toString())
			throw new Error("No permisions for this operation");

		const statusData = await trackOnboardingStatus(trackingId);

		if (statusData.merchant_id)
			await User.findByIdAndUpdate(
				auth.user._id,
				{ merchantId: statusData.merchant_id },
				{ new: true },
			);
		else {
			throw new Error("invalid resource id");
		}

		return statusData;
	} catch (error) {
		throw new Error(error);
	}
};

export default resolve;
