import {
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";
import userType from "../../../types/user-type.js";
import resolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "GetTopAuthors",
	description: "this is get top authors query",
	fields: {
		authors: {
			type: new GraphQLList(userType),
			description: "",
		},
		currentPage: {
			type: GraphQLInt,
			description: "",
		},
		numberOfPages: {
			type: GraphQLInt,
			description: "",
		},
		total: {
			type: GraphQLInt,
			description: "",
		},
	},
});

const args = {
	page: {
		type: GraphQLInt,
		description: "",
	},
	limit: {
		type: GraphQLInt,
		description: "",
	},
};

export default {
	type,
	args,
	resolve,
};
