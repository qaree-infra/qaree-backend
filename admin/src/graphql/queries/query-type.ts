import { GraphQLObjectType } from "graphql";
import userQueries from "./user/user-queries.js";
import bookQueries from "../queries/book/book-queries.js";
import categoriesQueries from "./categories/categories-query.js";
import offerQueries from "./offer/offer-queries.js";
import adminQueries from "./admin/admin-queries.js";

const queryType = new GraphQLObjectType({
	name: "Query",
	description: "This is the query type",
	fields: {
		...userQueries,
		...bookQueries,
		...categoriesQueries,
		...offerQueries,
		...adminQueries,
	},
});

export default queryType;
