import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
import resolve from "./resolve.js";

const moveBookToRecycleType = new GraphQLObjectType({
  name: "MoveBookToRecycleType",
  description: "this is the moved book to recycle bin type",
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
  type: moveBookToRecycleType,
  args: {
    bookId: {
      type: GraphQLString,
      description: ""
    }
  },
  resolve: resolve,
}
