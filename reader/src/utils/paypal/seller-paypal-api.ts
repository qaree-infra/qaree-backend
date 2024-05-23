import fetch, { Request } from "node-fetch";
import dotenv from "dotenv";
import User, { UserInterface } from "../../models/user.js";

dotenv.config();

// set some important variables
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PARTNER_MERCHANT_ID } =
	process.env;
const base = "https://api-m.sandbox.paypal.com";

export async function handleResponse(response) {
	console.log(response.status);
	if (response.status === 200 || response.status === 201) {
		return response.json();
	}
	const errorMessage = await response.text();
	console.log(errorMessage);
	throw new Error(errorMessage);
}

// generate access token
export async function generateAccessToken() {
	const auth = Buffer.from(
		PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
	).toString("base64");

	const response = await fetch(`${base}/v1/oauth2/token`, {
		method: "post",
		body: "grant_type=client_credentials",
		headers: {
			Authorization: `Basic ${auth}`,
		},
	});

	const jsonData = await handleResponse(response);

	return jsonData.access_token;
}

export async function trackOnboardingStatus(tracking_id: string) {
	const url = `${base}/v1/customer/partners/${PARTNER_MERCHANT_ID}/merchant-integrations?tracking_id=${tracking_id}`;

	console.log(url);

	const accessToken = await generateAccessToken();

	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});

	console.log(response);

	return handleResponse(response);
}

export async function getFullStatus(seller_merchant_id: string) {
	const url = `${base}/v1/customer/partners/${PARTNER_MERCHANT_ID}/merchant-integrations/${seller_merchant_id}`;

	const accessToken = await generateAccessToken();

	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});

	console.log("full status", response);

	return handleResponse(response);
}

export async function getAuthorPaymentStatus(user: UserInterface) {
	const statusData = await trackOnboardingStatus(String(user._id));

	if (statusData.merchant_id)
		await User.findByIdAndUpdate(
			user._id,
			{ merchantId: statusData.merchant_id },
			{ new: true },
		);

	const merchantStatusData = await getFullStatus(statusData.merchant_id);

	return merchantStatusData;
}
