import {
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";

const contentRaw = new GraphQLObjectType({
	name: "ContentRaw",
	description: "This is content raw",
	fields: {
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
	description: "this is book content time",
	fields: {
		content: { type: new GraphQLList(contentRaw), description: "" },
		allHTML: {
			type: new GraphQLList(contentRaw),
			description: "",
		},
	},
});

export default bookContent;
