import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import resolve from "./resolve.js";

const ePubFile = new GraphQLObjectType({
	name: "EPubFile",
	description: "this is ePub file",
	fields: {
		href: {
			type: GraphQLString,
			description: "",
		},
		id: {
			type: GraphQLString,
			description: "",
		},
		mediaType: {
			type: GraphQLString,
			description: "",
		},
	},
});

const ePubManifest = new GraphQLObjectType({
	name: "EPubManifest",
	description: "this is ePub manifest",
	fields: {
		files: {
			type: new GraphQLList(ePubFile),
			description: "this is lis of files",
		},
		total: {
			type: GraphQLInt,
			description: "total number of files"
		},
	},
});

const args = {
	bookId: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type: ePubManifest,
	args,
	resolve,
};
