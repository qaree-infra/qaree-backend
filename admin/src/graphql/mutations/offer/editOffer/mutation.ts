import { GraphQLString, GraphQLInt } from "graphql";
import offerType from "../../../types/offer-type.js";
import resolve from "./resolve.js";

const addOfferArgs = {
	id: {
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
	resolve,
};
