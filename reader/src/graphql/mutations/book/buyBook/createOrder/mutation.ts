import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import resolve from "./resolve.js";

const linkType = new GraphQLObjectType({
	name: "OrderLinkType",
	description: "This is order link type",
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
	name: "CreatePaymentOrder",
	description: "This is create buy book order payment",
	fields: {
		create_time: {
			type: GraphQLString,
			description: "",
		},
		update_time: {
			type: GraphQLString,
			description: "",
		},
		processing_instruction: {
			type: GraphQLString,
			description: "",
		},
		intent: {
			type: GraphQLString,
			description: "",
		},
		id: {
			type: GraphQLString,
			description: "",
		},
		status: {
			type: GraphQLString,
			description: "",
		},
		links: {
			type: new GraphQLList(linkType),
			description: "",
		},
	},
});

const args = {
	bookId: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type,
	args,
	resolve,
};
