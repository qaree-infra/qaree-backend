import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql"
import shelfType from "../shelf-type.js";
import resolve from './resolve.js'

const type = new GraphQLObjectType({
  name: "Library",
  description: "This is library type",
  fields: {
    shelves: {
      type: new GraphQLList(shelfType),
      description: ""
    },
    total: {
      type: GraphQLInt,
      description: ""
    },
    currentPage: {
      type: GraphQLInt,
      description: ""
    },
    numberOfPages: {
      type: GraphQLInt,
      description: ""
    },
  }
});

const args = {
  user: {
    type: GraphQLString,
    description: ""
  },
  limit: {
    type: GraphQLInt,
    description: ""
  },
  page: {
    type: GraphQLInt,
    description: ""
  },
}

export default {
  type,
  args,
  resolve,
}
