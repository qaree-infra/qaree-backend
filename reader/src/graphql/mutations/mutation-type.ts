import { GraphQLObjectType } from "graphql";
import UserMutation from "./user/user-mutation.js";
import BookMutations from "./book/book-mutations.js";
import ShelfMutations from "./library/shelf-mutation.js";
import ChatMutations from "./chat/chat-mutations.js";

const mutationType = new GraphQLObjectType({
	name: "Mutation",
	description: "",
	fields: {
		...UserMutation,
		...BookMutations,
		...ShelfMutations,
		...ChatMutations,
	},
});

export default mutationType;
