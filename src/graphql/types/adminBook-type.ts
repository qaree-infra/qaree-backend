import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLList,
	GraphQLFloat,
} from "graphql";
import adminType from "./admin-type.js";
import categoryType from "./category-type.js";
import { authorType } from "./myBook-type.js";
import fileType from "./file-type.js";

const adminBookType = new GraphQLObjectType({
	name: "AdminBookType",
	description: "",
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
		reviewer: {
			type: adminType,
			description: "",
		},
	},
});

export default adminBookType;
