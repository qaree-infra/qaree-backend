import { GraphQLString } from "graphql";
import ePubManifestType from "../../../../../types/fileContent/ePubManifest.js";

import resolve from "./resolve.js";

const args = {
	bookId: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type: ePubManifestType,
	args,
	resolve,
};
