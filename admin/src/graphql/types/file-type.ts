import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLFloat,
} from "graphql";

const fileType = new GraphQLObjectType({
	name: "File",
	description: "this is book file type",
	fields: {
		_id: {
			type: GraphQLID,
		},
		name: {
			type: GraphQLString,
			description: "",
		},
		size: {
			type: GraphQLFloat,
			description: "",
		},
		path: {
			type: GraphQLString,
			description: "",
		},
	},
});

export default fileType;
