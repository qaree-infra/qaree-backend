import { GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql"
import resolve from "./resolve.js"
import bookInfoType from "../../../types/book-type.js"

const type = new GraphQLObjectType({
  name: "BestSeller",
  description: "",
  fields: {
    books: {
      type: new GraphQLList(bookInfoType),

    }
  }
});

const args = {
  limit: {
    type: GraphQLInt,
    description: "",
  }
}

export default {
  type,
  args,
  resolve
}
