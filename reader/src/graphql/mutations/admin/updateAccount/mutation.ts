import { GraphQLString } from "graphql";
import adminType from "../../../types/admin-type.js";
import updateAccountResolve from "./resolve.js";

const updateAccountArgs = {
  name: {
    type: GraphQLString,
    description: "",
  },
  oldPassword: {
    type: GraphQLString,
    description: "",
  },
  newPassword: {
    type: GraphQLString,
    description: "",  
  }
}

export default {
  type: adminType,
  args: updateAccountArgs,
  resolve: updateAccountResolve,
}
