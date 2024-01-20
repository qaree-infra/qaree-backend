import { GraphQLInt, GraphQLString } from "graphql";
import resolve from "./resolve.js";
import shelfType from "../../../types/shelf-type.js";

const type = shelfType;
const args = {
  shelf: {
    type: GraphQLString,
    description: ""
  },
  user: {
    type: GraphQLString,
    description: ""
  },
  booksLimit: {
    type: GraphQLInt,
    description: ""
  },
  booksPage: {
    type: GraphQLInt,
    description: ""
  }
};

export default {
	type,
	args,
	resolve,
};
