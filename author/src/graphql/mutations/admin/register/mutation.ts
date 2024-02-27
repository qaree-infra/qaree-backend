import { GraphQLString } from "graphql";
import adminType from "../../../types/admin-type.js";
import registerResolve from "./resolve.js";

const args = {
  name: {
    type: GraphQLString,
    description: '',
  },
  email: {
    type: GraphQLString,
    description: '',
  },
  password: {
    type: GraphQLString,
    description: '',
  },
}

export default {
  type: adminType,
  args: args,
  resolve: registerResolve,
}
