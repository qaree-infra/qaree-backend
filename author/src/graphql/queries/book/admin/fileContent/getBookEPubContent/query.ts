import {
	GraphQLString,
} from "graphql";
import resolve from "./resolve.js";
import { adminBookContent } from "../../../../../types/fileContent/ePubContent.js";

const args = {
	bookId: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type: adminBookContent,
	args,
	resolve,
};
