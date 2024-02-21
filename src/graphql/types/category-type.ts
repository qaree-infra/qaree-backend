import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
} from "graphql";
import fileType from "./file-type.js";

const categoryType = new GraphQLObjectType({
	name: "CategroyType",
	description: "This books category type",
	fields: {
		_id: {
			type: GraphQLID,
		},
		name_ar: {
			type: GraphQLString,
			description: "",
		},
		name_en: {
			type: GraphQLString,
			description: "",
		},
    icon: {
      type: fileType,
      description: ""
    },
		createdAt: {
			type: GraphQLString,
			description: "",
		},
		updatedAt: {
			type: GraphQLString,
			description: "",
		},
	},
});

export default categoryType;
