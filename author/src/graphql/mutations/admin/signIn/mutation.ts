import { GraphQLObjectType, GraphQLString } from "graphql";
import adminSignInInputs from "./args.js";
import adminSignInResolve from "./resolver.js";

const signInType = new GraphQLObjectType({
  name: "SignInAdminType",
  description: 'admin sign in type',
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
  args: adminSignInInputs,
  resolve: adminSignInResolve
}
