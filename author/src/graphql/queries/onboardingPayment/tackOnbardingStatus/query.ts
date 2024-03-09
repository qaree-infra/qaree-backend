import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import resolve from "./resolve.js";

const linkType = new GraphQLObjectType({
	name: "TrackingOnboardingStatusLink",
	description: "",
	fields: {
		href: {
			type: GraphQLString,
			description: "",
		},
		rel: {
			type: GraphQLString,
			description: "",
		},
		method: {
			type: GraphQLString,
			description: "",
		},
	},
});

const type = new GraphQLObjectType({
	name: "TrackOnboardingStatus",
	description: "this is track onboarding status type",
	fields: {
		merchantId: {
			type: GraphQLString,
			description: "",
		},
		trackingId: {
			type: GraphQLString,
			description: "",
		},
		links: {
			type: new GraphQLList(linkType),
			description: "",
		},
	},
});

export default {
	type: type,
	args: {
		trackingId: {
			type: GraphQLString,
			description: "",
		},
	},
	resolve,
};
