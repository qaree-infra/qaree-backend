import { GraphQLObjectType, GraphQLBoolean, GraphQLString } from "graphql"
import resolve from "./resolve.js"

const type = new GraphQLObjectType({
  name: "AddRegisterationToken",
  description: "this is add the registration token for notifications",
  fields: {
    success: {
      type: GraphQLBoolean,
      description: "",
    },
    message: {
      type: GraphQLString,
      description: "",
    },
  }
});

const args = {
  token: {
    type: GraphQLString,
    description: "",
  },
}

export default {
  type,
  args,
  resolve,
}
