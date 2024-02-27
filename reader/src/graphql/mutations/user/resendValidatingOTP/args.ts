import { GraphQLString } from "graphql";

const resendValidatingAccountInputs = {
	email: {
		type: GraphQLString,
		description: "",
	},
	lang: {
		type: GraphQLString,
		description: "",
	}
};

export default resendValidatingAccountInputs;
