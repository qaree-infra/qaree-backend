import { GraphQLString } from "graphql";
import categoryType from "../../../types/category-type.js";
import editCategroyResolve from "./resolve.js";
import { commonArgs } from "../addCategory/mutation.js";

const args = {
	categoryId: {
		type: GraphQLString,
		description: "",
	},
	...commonArgs
};

export default {
	type: categoryType,
	args: args,
	resolve: editCategroyResolve,
};
