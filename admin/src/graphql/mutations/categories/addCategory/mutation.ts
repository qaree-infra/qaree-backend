import { GraphQLString } from "graphql";
import categoryType from "../../../types/category-type.js";
import addCategroyResolve from "./resolve.js";

export const commonArgs = {
	name_ar: {
		type: GraphQLString,
		description: "",
	},
	name_en: {
		type: GraphQLString,
		description: "",
	},
	background: {
		type: GraphQLString,
		description: "",
	}
}

export default {
	type: categoryType,
	args: commonArgs,
	resolve: addCategroyResolve,
};
