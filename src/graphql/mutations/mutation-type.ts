import { GraphQLObjectType } from "graphql";
import UserMutation from "../user/user-mutation.js";
import BookMutations from "./book/book-mutations.js";
import AdminMutations from "./admin/admin-mutations.js";
import ShelfMutations from "../library/shelf-mutation.js";

const mutationType = new GraphQLObjectType({
	name: "Mutation",
	description: "",
	fields: {
		...UserMutation,
		...BookMutations,
		...AdminMutations,
		...ShelfMutations,
	},
});

export default mutationType;
