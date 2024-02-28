import { GraphQLString } from "graphql";
import bookInfoType from "../../../../types/book-type.js";
import getBookInfoResolve from './resolve.js';

export default {
  type: bookInfoType,
  args: {
    bookId: {
      type: GraphQLString,
      description: "",
    }
  },
  resolve: getBookInfoResolve,
}
