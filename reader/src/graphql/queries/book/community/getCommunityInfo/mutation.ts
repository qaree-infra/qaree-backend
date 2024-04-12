import {
	GraphQLString,
} from "graphql";
import resolve from "./resolve.js";
import bookInfoType from "../../../../types/book-type.js";
import userType from "../../../../types/user-type.js";
import bookCommunityType from "../../../../types/book-community-type.js";

const args = {
	id: {
		type: GraphQLString,
		description: "",
	},
	bookId: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type: bookCommunityType,
	args,
	resolve,
};