import {
	GraphQLString,
} from "graphql";
import resolve from "./resolve.js";
import { bookContent } from "../../../../../types/fileContent/ePubContent.js";

const args = {
	bookId: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type: bookContent,
	args,
	resolve,
};
