import {
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";
import userType from "./user-type.js";
import bookInfoType from "./book-type.js";

export const communityMembers = new GraphQLObjectType({
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

export default new GraphQLObjectType({
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
