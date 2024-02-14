import {
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from "graphql";
import resolve from "./resolve.js";

const contentRaw = new GraphQLObjectType({
	name: "UserContentRaw",
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
	name: "UserBookContent",
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
	type: bookContent,
	args,
	resolve,
};
