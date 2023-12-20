import { GraphQLString } from "graphql";
import bookInfoType from "../../book-type.js";
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
