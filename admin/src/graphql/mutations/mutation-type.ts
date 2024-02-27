import { GraphQLObjectType } from "graphql";
import BookMutations from "./book/book-mutations.js";
import AdminMutations from "./admin/admin-mutations.js";
import CategoriesMutations from "./categories/categories-mutations.js";
import OfferMutations from "./offer/offer-mutations.js";

const mutationType = new GraphQLObjectType({
	name: "Mutation",
	description: "",
	fields: {
		...BookMutations,
		...AdminMutations,
		...CategoriesMutations,
		...OfferMutations
	},
});

export default mutationType;
