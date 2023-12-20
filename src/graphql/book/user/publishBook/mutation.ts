import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from "graphql"
import myBook from '../../myBook-type.js';
import publishBookResolve from './resolve.js'

const publishBookToType = new GraphQLObjectType({
  name: "PublishBook",
  description: "this is the publish book type",
  fields: {
    message: {
      type: GraphQLString,
      description: "",
    },
    book: {
      type: myBook,
      description: ""
    },
  }
})

export default {
  type: publishBookToType,
  args: {
    bookId: {
      type: GraphQLString,
      description: "",
    }
  },
  resolve: publishBookResolve,
}
