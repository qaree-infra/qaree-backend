import { auth } from "../../../../middleware/general/auth.js";
import { generateActionURL } from "../../../../utils/paypal-api.js";

type Link = {
	href: string;
	rel: string;
	method: "GET" | "POST" | "PATCH";
	description?: string;
};

const resolve = async (_, args, context) => {
	try {
		const { lang } = context.query;

		const auth: auth = context.auth;
		if (auth.error) throw new Error(auth.error);

		const generatedActionUrl: { links: Link[] } = await generateActionURL(
			auth.user,
			lang,
		);

		const url: Link = generatedActionUrl.links.filter(
			(l: Link) => l.rel === "action_url",
		)[0];

		return { actionUrl: url.href };
	} catch (error) {
		throw new Error(error?.message || error);
	}
};

export default resolve;
