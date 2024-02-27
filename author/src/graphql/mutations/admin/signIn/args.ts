import { GraphQLString } from "graphql";

const adminSignInInputs = {
	email: {
		type: GraphQLString,
		description: "",
	},
  password: {
    type: GraphQLString,
    description: "",
  }
};

export default adminSignInInputs;
