import { GraphQLObjectType } from "graphql";
import UserMutation from "./user/user-mutation.js";
import BookMutations from "./book/book-mutations.js";
import ShelfMutations from "./library/shelf-mutation.js";
import CategoriesMutations from "./categories/categories-mutations.js";
import OfferMutations from "./offer/offer-mutations.js";

const mutationType = new GraphQLObjectType({
	name: "Mutation",
	description: "",
	fields: {
		...UserMutation,
		...BookMutations,
		...ShelfMutations,
		...CategoriesMutations,
		...OfferMutations
	},
});

export default mutationType;
