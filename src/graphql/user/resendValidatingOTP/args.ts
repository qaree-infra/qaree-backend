import { GraphQLString, GraphQLInputObjectType } from "graphql";

const resendValidatingAccountInputs = {
	email: {
		type: GraphQLString,
		description: "",
	},
};

export default resendValidatingAccountInputs;
