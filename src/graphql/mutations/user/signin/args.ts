import { GraphQLString } from "graphql";

const signinInputs = {
	email: {
		type: GraphQLString,
		description: "",
	},
  password: {
    type: GraphQLString,
    description: "",
  }
};

export default signinInputs;
