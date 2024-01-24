import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLBoolean,
	GraphQLInt,
	GraphQLList,
	GraphQLFloat,
} from "graphql";
import categoryType from "./category-type.js";
import fileType from "./file-type.js";

export const authorType = new GraphQLObjectType({
	name: "Author",
	description: "this is book author type",
	fields: {
		_id: {
			type: GraphQLID,
		},
		name: {
			type: GraphQLString,
			description: "",
		},
		avatar: {
			type: GraphQLString,
			description: "",
		},
	},
});

const userBookType = new GraphQLObjectType({
	name: "UserBook",
	description: "This book datails",
	fields: {
		_id: {
			type: GraphQLID,
		},
		name: {
			type: GraphQLString,
			description: "",
		},
		description: {
			type: GraphQLString,
			description: "",
		},
		isbn: {
			type: GraphQLString,
			description: "",
		},
		edition: {
			type: GraphQLInt,
			description: "",
		},
		publishingRights: {
			type: GraphQLBoolean,
			description: "",
		},
		categories: {
			type: new GraphQLList(categoryType),
			description: "",
		},
		avgRate: {
			type: GraphQLInt,
			description: "",
		},
		price: {
			type: GraphQLFloat,
			description: "",
		},
		language: {
			type: GraphQLString,
			description: "",
		},
		author: {
			type: authorType,
			description: "",
		},
		sample: {
			type: fileType,
			description: "",
		},
		cover: {
			type: fileType,
			description: "",
		},
		file: {
			type: fileType,
			description: "",
		},
		status: {
			type: GraphQLString,
			description: "",
		},
		createdAt: {
			type: GraphQLString,
			description: "",
		},
		updatedAt: {
			type: GraphQLString,
			description: "",
		},
		publishionDate: {
			type: GraphQLString,
			description: "",
		},
		rejectionReasons: {
			type: GraphQLString,
			description: "",
		},
	},
});

export default userBookType;
