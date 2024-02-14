import {
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";
import resolve from "./resolve.js";

const contentRaw = new GraphQLObjectType({
	name: "ContentRaw",
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

const type = new GraphQLObjectType({
	name: "BookContent",
	description: "this is book content time",
	fields: {
		content: { type: new GraphQLList(contentRaw), description: "" },
	},
});

const args = {
	bookId: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type,
	args,
	resolve,
};
