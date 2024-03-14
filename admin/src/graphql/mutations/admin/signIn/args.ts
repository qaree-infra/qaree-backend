import { GraphQLString } from "graphql";

const signInInputs = {
	email: {
		type: GraphQLString,
		description: "",
	},
  password: {
    type: GraphQLString,
    description: "",
  }
};

export default signInInputs;
