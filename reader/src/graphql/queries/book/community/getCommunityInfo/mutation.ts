import {
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";
import resolve from "./resolve.js";
import bookInfoType from "../../../../types/book-type.js";
import userType from "../../../../types/user-type.js";

const communityMembers = new GraphQLObjectType({
	name: "CommunityMembers",
	fields: {
		members: {
			type: new GraphQLList(userType),
		},
		currentPage: {
			type: GraphQLInt,
			description: "",
		},
		numberOfPages: {
			type: GraphQLInt,
			description: "",
		},
		totalMembers: {
			type: GraphQLInt,
			description: "",
		},
	},
});

const type = new GraphQLObjectType({
	name: "BookCommunity",
	description: "this is book community",
	fields: {
		_id: {
			type: GraphQLString,
			description: "",
		},
		lastMessage: {
			type: GraphQLString,
			description: "",
		},
		book: {
			type: bookInfoType,
			description: "",
		},
		roomId: {
			type: GraphQLString,
			description: "",
		},
		members: {
			type: communityMembers,
			description: "",
		},
	},
});

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
	type,
	args,
	resolve,
};
