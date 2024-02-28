import { GraphQLString } from "graphql";
import book from "../../../types/book-type.js";
import getMyBookResolve from "./resolve.js";

const bookArgs = {
	bookId: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type: book,
	args: bookArgs,
	description: "get user book",
	resolve: getMyBookResolve,
};
