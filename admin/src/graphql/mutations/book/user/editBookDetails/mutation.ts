import { GraphQLString } from "graphql";
import bookDetailsInputs from "../addBookDetails/args.js";
import bookType from "../../../../types/myBook-type.js";
import editBookDetails from "./resolve.js";

export default {
	type: bookType,
	args: {
		bookId: { type: GraphQLString, description: "" },
		...bookDetailsInputs,
	},
	resolve: editBookDetails,
};
