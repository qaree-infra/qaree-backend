import { GraphQLString, GraphQLInputObjectType } from "graphql";

const verifyAccountInput = {
	otp: {
		type: GraphQLString,
		description: "",
	},
	email: {
		type: GraphQLString,
		description: "",
	},
};

export default verifyAccountInput;
