import { GraphQLObjectType, GraphQLString } from "graphql";
import signInInputs from "./args.js";
import signInResolve from "./resolver.js";

const signInType = new GraphQLObjectType({
  name: "SignInType",
  description: 'sign in type',
  fields: {
    message: {
      type: GraphQLString,
      description: "",
    },
    access_token: {
      type: GraphQLString,
      description: "",
    }
  }
});

export default {
  type: signInType,
  args: signInInputs,
  resolve: signInResolve
}
