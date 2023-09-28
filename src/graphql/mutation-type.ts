import { GraphQLObjectType, GraphQLString } from "graphql";
import UserMutation from "./user/user-mutation.js";

const mutationType = new GraphQLObjectType({
	name: "Mutation",
	description: "",
	fields: {
		...UserMutation,
		// resetPassword: ,
	},
});

export default mutationType;
