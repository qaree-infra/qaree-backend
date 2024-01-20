import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLInt } from "graphql";

import bookInfoType from "../types/book-type.js";
import { ShelfInterface } from "../../models/shelf.js";

export interface ShelfData extends ShelfInterface {
	totalBooks?: number;
	numberOfBooksPages?: number;
	currentBooksPage?: number;
}

const shelfType = new GraphQLObjectType({
  name: "ShelfType",
  description: "This liberary shelf data",
  fields: {
    _id: {
			type: GraphQLID,
		},
		name: {
			type: GraphQLString,
			description: "",
		},
    books: {
      type: new GraphQLList(bookInfoType),
      description: "",
    },
		totalBooks: {
			type: GraphQLInt,
			description: "",
		},
		numberOfBooksPages: {
			type: GraphQLInt,
			description: "",
		},
		currentBooksPage: {
			type: GraphQLInt,
			description: "",
		},
    createdAt: {
			type: GraphQLString,
			description: "",
		},
		updatedAt: {
			type: GraphQLString,
			description: "",
		},
  }
})

export default shelfType;
