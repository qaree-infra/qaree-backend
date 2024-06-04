import { GraphQLObjectType, GraphQLString } from "graphql";
import resolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "FacebookLoginType",
	description: "",
	fields: {
		message: {
			type: GraphQLString,
		},
		access_token: {
			type: GraphQLString,
		},
	},
});

const args = {
	token: {
		type: GraphQLString,
		description: "",
	},
	regestrationToken: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type,
	args,
	resolve,
};
