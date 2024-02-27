import {
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
} from "graphql";
import resolve from "./resolve.js";
import userType from "../../../types/user-type.js";

const type = new GraphQLObjectType({
	name: "GetAllUsersType",
	description: "",
	fields: {
		users: {
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
	sortBy: {
		type: GraphQLString,
		description: "",
	},
	page: {
		type: GraphQLInt,
		description: "",
	},
	limit: {
		type: GraphQLInt,
		description: "",
	},
	keyword: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type,
	args,
	resolve,
};
