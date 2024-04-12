import { GraphQLInt, GraphQLString } from "graphql";
import resolve from "./resolve.js";
import { communityMembers } from "../../../../types/book-community-type.js";

const args = {
	id: {
		type: GraphQLString,
		description: "",
	},
	bookId: {
		type: GraphQLString,
		description: "",
	},
	limitMembers: {
		type: GraphQLInt,
		description: "",
	},
	page: {
		type: GraphQLInt,
		description: "",
	},
};

export default {
	type: communityMembers,
	args,
	resolve,
};
