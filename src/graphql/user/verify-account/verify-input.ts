import { GraphQLString, GraphQLInputObjectType } from "graphql";

const verifyAccountInput = {
	email: {
		type: GraphQLString,
		description: "",
	},
	otp: {
		type: GraphQLString,
		description: "",
	},
};

export default verifyAccountInput;
