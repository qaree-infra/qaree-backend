import { GraphQLString } from "graphql";

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

export default updateAccountArgs;

