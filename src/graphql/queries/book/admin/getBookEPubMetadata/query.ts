import { GraphQLObjectType, GraphQLString } from "graphql";
import resolve from "./resolve.js";

const ePubFileMetadataType = new GraphQLObjectType({
	name: "EPubFileMetadataType",
	description: "this is epub file metadata type",
	fields: {
		publisher: {
			type: GraphQLString,
			description: "",
		},
		language: {
			type: GraphQLString,
			description: "",
		},
		title: {
			type: GraphQLString,
			description: "",
		},
		subject: {
			type: GraphQLString,
			description: "",
		},
		description: {
			type: GraphQLString,
			description: "",
		},
		creator: {
			type: GraphQLString,
			description: "",
		},
		creatorFileAs: {
			type: GraphQLString,
			description: "",
		},
		date: {
			type: GraphQLString,
			description: "",
		},
		ISBN: {
			type: GraphQLString,
			description: "",
		},
		UUID: {
			type: GraphQLString,
			description: "",
		},
		generator: {
			type: GraphQLString,
			description: "",
		},
		cover: {
			type: GraphQLString,
			description: "",
		},
		specifiedFonts: {
			type: GraphQLString,
			description: "",
		},
		modified: {
			type: GraphQLString,
			description: "",
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
	type: ePubFileMetadataType,
	args,
	resolve,
};
