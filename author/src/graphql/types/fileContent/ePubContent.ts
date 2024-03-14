import {
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";

const contentRaw = new GraphQLObjectType({
	name: "AdminContentRaw",
	description: "This is content raw",
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
		title: {
			type: GraphQLString,
			description: "",
		},
		order: {
			type: GraphQLInt,
			description: "",
		},
		level: {
			type: GraphQLInt,
			description: "",
		},
	},
});

const bookContent = new GraphQLObjectType({
	name: "BookContent",
	description: "this is book content for admin",
	fields: {
		content: { type: new GraphQLList(contentRaw), description: "" },
		allHTML: {
			type: new GraphQLList(contentRaw),
			description: "",
		},
	},
});

export default bookContent;
