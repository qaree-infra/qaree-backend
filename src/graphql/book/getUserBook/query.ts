import { GraphQLString } from "graphql";
import myBook from "../myBook-type.js";
import getUserBookResolve from "./resolve.js";

const userBookArgs = {
	bookId: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type: myBook,
	args: userBookArgs,
	description: "get user book",
	resolve: getUserBookResolve,
};
