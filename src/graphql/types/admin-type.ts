import { GraphQLObjectType, GraphQLID, GraphQLString } from "graphql";
import fileType from "./file-type.js";

const adminType = new GraphQLObjectType({
	name: "Admin",
	description: "this is admin type",
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
		updatedAt: {
			type: GraphQLString,
		},
		createdAt: {
			type: GraphQLString,
		},
	},
});

export default adminType;
