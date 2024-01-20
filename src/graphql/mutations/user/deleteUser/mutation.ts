import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";

import deleteAccount from "./resolve.js";

const deleteAccountType = new GraphQLObjectType({
  name: "DeleteAccountType",
  description: "this is the delete account type",
  fields: {
    message: {
      type: GraphQLString,
      description: ""
    },
    deleted_id: {
      type: GraphQLString,
      description: ""
    },
    success: {
      type: GraphQLBoolean,
      description: ""
    }
  }
});

export default {
  type: deleteAccountType,
  resolve: deleteAccount
}
