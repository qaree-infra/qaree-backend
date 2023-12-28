import resolve from "./resolve.js";
import shelfType from "../shelf-type.js";
import { GraphQLString } from "graphql";

export default {
  type: shelfType,
  args: {
    name: {
      type: GraphQLString,
      description: ""
    }
  },
  resolve
}
