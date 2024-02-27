import { GraphQLString } from "graphql";
import categoryType from "../../../types/category-type.js";
import editCategroyResolve from "./resolve.js";

const args = {
	categoryId: {
		type: GraphQLString,
		description: "",
	},
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
	resolve: editCategroyResolve,
};
