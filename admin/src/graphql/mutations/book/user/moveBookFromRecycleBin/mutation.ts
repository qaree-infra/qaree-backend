import { GraphQLString } from "graphql";
import resolve from "./resolve.js";
import { moveBookToRecycleType } from "../moveBookToRecycleBin/mutation.js";

export default {
	type: moveBookToRecycleType,
	args: {
		bookId: {
			type: GraphQLString,
			description: "",
		},
	},
	resolve: resolve,
};
