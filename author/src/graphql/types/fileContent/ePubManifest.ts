import {
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";

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
			description: "total number of files",
		},
	},
});

export default ePubManifest;
