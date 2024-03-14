import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLList,
	GraphQLInt,
} from "graphql";

import bookInfoType from "./book-type.js";
import { ShelfInterface } from "../../models/shelf.js";

export interface ShelfData extends ShelfInterface {
	totalBooks?: number;
	numberOfBooksPages?: number;
	currentBooksPage?: number;
	name?: string;
}

const bookShelf = new GraphQLObjectType({
	name: "BookShelf",
	description: "",
	fields: {
		book: {
			type: bookInfoType,
			description: "",
		},
		status: {
			type: GraphQLString,
			description: "",
		},
		readingProgress: {
			type: GraphQLInt,
			description: "",
		},
	},
});

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
			type: new GraphQLList(bookShelf),
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
	},
});

export default shelfType;
