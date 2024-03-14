import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import resolve from "./resolve.js";
import activity from "../../../../queries/book/activities/activity-type.js";

const capturedOrderType = new GraphQLObjectType({
	name: "CapaturedPaymentOrder",
	description: "This is create buy book order payment",
	fields: {
		id: {
			type: GraphQLString,
			description: "",
		},
		status: {
			type: GraphQLString,
			description: "",
		},
	},
});

const type = new GraphQLObjectType({
	name: "CompletePaymentOrder",
	description: "This is captured order type",
	fields: {
		capturedOrder: {
			type: capturedOrderType,
			description: "",
		},
		purchasedBook: {
			type: activity,
			description: "",
		},
	},
});

const args = {
	bookId: {
		type: GraphQLString,
		description: "",
	},
	orderId: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type,
	args,
	resolve,
};
