import { GraphQLObjectType } from "graphql";
import userQueries from "./user/user-queries.js";
import bookQueries from "../queries/book/book-queries.js";
import libraryQueries from './library/shelf-queries.js';
import categoriesQueries from "./categories/categories-query.js";
import offerQueries from "./offer/offer-queries.js";

const queryType = new GraphQLObjectType({
	name: "Query",
	description: "This is the query type",
	fields: {
		...userQueries,
		...bookQueries,
		...libraryQueries,
		...categoriesQueries,
		...offerQueries
	},
});

export default queryType;
