import { GraphQLInt, GraphQLString } from "graphql";
import addOfferResolve from "./resolve.js";
import offerType from "../../../../types/offer-type.js";

const addOfferArgs = {
	bookId: {
		type: GraphQLString,
		description: "",
	},
	percent: {
		type: GraphQLInt,
		description: "",
	},
	expireAt: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type: offerType,
	args: addOfferArgs,
	resolve: addOfferResolve,
};
