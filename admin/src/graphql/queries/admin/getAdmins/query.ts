import {
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
} from "graphql";
import resolve from "./resolve.js";
import adminType from "../../../types/admin-type.js";

const type = new GraphQLObjectType({
	name: "GetAdminsType",
	description: "",
	fields: {
		admins: {
			type: new GraphQLList(adminType),
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
