import { GraphQLString } from "graphql";
import categoryType from "../../../types/category-type.js";
import addCategroyResolve from "./resolve.js";

const args = {
	name_ar: {
		type: GraphQLString,
		description: "",
	},
	name_en: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type: categoryType,
	args: args,
	resolve: addCategroyResolve,
};
