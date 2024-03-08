import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// set some important variables
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PARTNER_MERCHANT_ID } =
	process.env;
const base = "https://api-m.sandbox.paypal.com";

function getAuthAssertionValue(clientId: string, sellerPayerId: string) {
	const auth1 = Buffer.from('{"alg":"none"}').toString("base64");
	const auth2 = Buffer.from(
		`{"iss":${clientId},"payer_id":${sellerPayerId}}`,
	).toString("base64");

	return `${auth1}.${auth2}.`;
}

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

// generate client token
export async function generateClientToken(author_merchant_id: string) {
	const accessToken = await generateAccessToken();

	const authAssertion = getAuthAssertionValue(
		PAYPAL_CLIENT_ID,
		author_merchant_id,
	);

	const response = await fetch(`${base}/v1/identity/generate-token`, {
		method: "post",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Accept-Language": "en_US",
			"Content-Type": "application/json",
			"PayPal-Auth-Assertion": authAssertion,
			"PayPal-Partner-Attribution-Id": "BN-CODE",
		},
	});

	const jsonData = await handleResponse(response);
	return jsonData.client_token;
}
