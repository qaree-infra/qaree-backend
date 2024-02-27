import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql"
import getAllResolve from "./resolve.js"
import categoryType from "../../../../types/category-type.js"

const getAllCategories = new GraphQLObjectType({
  name: "AdminGetAllCategories",
  description: "This is get all categories type",
  fields: {
    categories: {
      type: new GraphQLList(categoryType),
      description: "",
      },
      currentPage: {
        type: GraphQLInt,
        description: "",
      },
      numberOfPages: {
        type: GraphQLInt,
        description: "",
      },
      totalCompleted: {
        type: GraphQLInt,
        description: "",
      },
      totalUncompleted: {
        type: GraphQLInt,
        description: "",
      },
      total: {
        type: GraphQLInt,
        description: "",
      },
    }
})

const args = {
  limit: {
    type: GraphQLInt,
    description: ""
  },
  page: {
    type: GraphQLInt,
    description: ""
  },
  completed: {
    type: GraphQLBoolean,
    description: ""
  }
}

export default {
  type: getAllCategories,
  args: args,
  resolve: getAllResolve,
}
