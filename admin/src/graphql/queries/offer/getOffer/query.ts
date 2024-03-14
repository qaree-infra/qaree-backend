import { GraphQLString } from "graphql";
import offerType from "../../../types/offer-type.js";
import resolve from "./resolve.js";

const args = {
	id: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type: offerType,
	args,
	resolve,
};
