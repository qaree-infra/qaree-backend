import { GraphQLObjectType } from "graphql";
import userQueries from "./user/user-queries.js";
import bookQueries from "../queries/book/book-queries.js";
import categoriesQueries from "./categories/categories-query.js";
import paymentQueries from "./onboardingPayment/payment-queries.js";

const queryType = new GraphQLObjectType({
	name: "Query",
	description: "This is the query type",
	fields: {
		...userQueries,
		...bookQueries,
		...categoriesQueries,
		...paymentQueries,
	},
});

export default queryType;
