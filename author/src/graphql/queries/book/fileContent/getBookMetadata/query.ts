import { GraphQLString } from "graphql";
import resolve from "./resolve.js";
import ePubFileMetadataType from "../../../../types/fileContent/ePubMetadata.js";

const args = {
	bookId: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type: ePubFileMetadataType,
	args,
	resolve,
};
