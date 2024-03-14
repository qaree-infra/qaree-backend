import { GraphQLObjectType, GraphQLString } from "graphql";
import resolve from "./resolve.js";

const type = new GraphQLObjectType({
  name: "GetSignupActionURL",
  description: "get signup action url",
  fields: {
    actionURL: {
      type: GraphQLString,
      description: "",
    }
  }
})

export default {
  type,
  resolve,
}
