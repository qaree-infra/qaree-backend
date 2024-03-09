import fetch, { Request } from "node-fetch";
import dotenv from "dotenv";
import { UserInterface } from "../models/user.js";

dotenv.config();

// set some important variables
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PARTNER_MERCHANT_ID } =
	process.env;
const base = "https://api-m.sandbox.paypal.com";

export async function handleResponse(response: Request) {
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

export const generateActionURL = async (user: UserInterface, lang: string) => {
	const url = `${base}/v2/customer/partner-referrals`;

	const payload = {
		email: user.email, // take it from user data
		preferred_language_code: lang, // take it from client side
		tracking_id: user._id,
		/* Todo: change partner_logo_url and return_url */
		partner_config_override: {
			partner_logo_url:
				"https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg",
			return_url: "http://localhost:8888/author",
			return_url_description:
				"the url to return the merchant after the paypal onboarding process.",
			show_add_credit_card: true,
		},
		operations: [
			{
				operation: "API_INTEGRATION",
				api_integration_preference: {
					rest_api_integration: {
						integration_method: "PAYPAL",
						integration_type: "THIRD_PARTY",
						third_party_details: {
							features: ["PAYMENT", "REFUND"],
						},
					},
				},
			},
		],
		products: ["EXPRESS_CHECKOUT"],
		legal_consents: [
			{
				type: "SHARE_DATA_CONSENT",
				granted: true,
			},
		],
	};

	const accessToken = await generateAccessToken();

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(payload),
	});

	return handleResponse(response);
};

export async function trackOnboardingStatus(tracking_id: string) {
	const url = `${base}/v1/customer/partners/${PARTNER_MERCHANT_ID}/merchant-integrations?tracking_id=${tracking_id}`;

	const accessToken = await generateAccessToken();

	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});

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

	return handleResponse(response);
}
