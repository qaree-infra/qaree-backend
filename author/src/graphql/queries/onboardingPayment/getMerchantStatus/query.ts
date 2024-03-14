import {
	GraphQLBoolean,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";
import resolve from "./resolve.js";

const productType = new GraphQLObjectType({
	name: "MerchantProduct",
	description: "",
	fields: {
		name: {
			type: GraphQLString,
			description: "",
		},
		status: {
			type: GraphQLString,
			description: "",
		},
		vetting_status: {
			type: GraphQLString,
			description: "",
		},
		capabilities: {
			type: new GraphQLList(GraphQLString),
			description: "",
		},
	},
});

const capabilityType = new GraphQLObjectType({
	name: "MerchantCapability",
	description: "",
	fields: {
		name: {
			type: GraphQLString,
			description: "",
		},
		status: {
			type: GraphQLString,
			description: "",
		},
	},
});

const oauthThirdParty = new GraphQLObjectType({
	name: "OAuthThirdParty",
	description: "",
	fields: {
		partner_client_id: {
			type: GraphQLString,
			description: "",
		},
		merchant_client_id: {
			type: GraphQLString,
			description: "",
		},
		scopes: {
			type: new GraphQLList(GraphQLString),
			description: "",
		},
	},
});

const oauthIntergration = new GraphQLObjectType({
	name: "OAuthIntergation",
	description: "",
	fields: {
		integration_type: {
			type: GraphQLString,
			description: "",
		},
		integration_method: {
			type: GraphQLString,
			description: "",
		},
		oauth_third_party: {
			type: new GraphQLList(oauthThirdParty),
			description: "",
		},
	},
});

const type = new GraphQLObjectType({
	name: "GetMerchantStatus",
	description: "this is get merchant status type",
	fields: {
		merchantId: {
			type: GraphQLString,
			description: "",
		},
		trackingId: {
			type: GraphQLString,
			description: "",
		},
		products: {
			type: new GraphQLList(productType),
			description: "",
		},
		capabilities: {
			type: new GraphQLList(capabilityType),
			description: "",
		},
		payments_receivable: {
			type: GraphQLBoolean,
			description: "",
		},
		legal_name: {
			type: GraphQLString,
			description: "",
		},
		primary_email_confirmed: {
			type: GraphQLString,
			description: "",
		},
		oauth_integrations: {
			type: GraphQLList(oauthIntergration),
			description: "",
		},
	},
});

export default {
	type,
	resolve,
};
