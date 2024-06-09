import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
} from "graphql";
import fileType from "./file-type.js";

const userType = new GraphQLObjectType({
	name: "User",
	description: "This is the user type",
	fields: {
		_id: {
			type: GraphQLID,
		},
		name: {
			type: GraphQLString,
		},
		email: {
			type: GraphQLString,
		},
		avatar: {
			type: fileType,
		},
		bio: {
			type: GraphQLString,
		},
		merchantId: {
			type: GraphQLString,
		},
		updatedAt: {
			type: GraphQLString,
		},
		createdAt: {
			type: GraphQLString,
		},
	},
});

export default userType;
