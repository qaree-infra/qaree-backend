import { GraphQLObjectType, GraphQLString } from "graphql";
import refreshTokenResolve from "./resolve.js";

const refreshTokenType = new GraphQLObjectType({
	name: "RefreshTokenType",
	description: "refresh token type",
	fields: {
		message: {
			type: GraphQLString,
		},
		refresh_token: {
			type: GraphQLString,
		},
	},
});

export default {
	type: refreshTokenType,
	description: "This is the refresh token",
	resolve: refreshTokenResolve,
};
