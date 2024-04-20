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
		vettingStatus: {
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
		partnerClientId: {
			type: GraphQLString,
			description: "",
		},
		merchantClientId: {
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
		integrationType: {
			type: GraphQLString,
			description: "",
		},
		integrationMethod: {
			type: GraphQLString,
			description: "",
		},
		oauthThirdParty: {
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
		paymentsReceivable: {
			type: GraphQLBoolean,
			description: "",
		},
		legalName: {
			type: GraphQLString,
			description: "",
		},
		primaryEmailConfirmed: {
			type: GraphQLString,
			description: "",
		},
		oauthIntegrations: {
			type: GraphQLList(oauthIntergration),
			description: "",
		},
	},
});

export default {
	type,
	resolve,
};
