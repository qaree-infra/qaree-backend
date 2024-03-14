import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from "graphql";
import shelfType from "../../../types/shelf-type.js";
import resolve from "./resolve.js";

const type = new GraphQLObjectType({
	name: "CreateShelfType",
	description: "this is create shelf type",
	fields: {
		shelf: {
      type: shelfType,
      description: ""
    },
    message: {
      type: GraphQLString,
      description: ""
    },
    success: {
      type: GraphQLBoolean,
      description: ""
    }
	},
});

export default {
	type: type,
	args: {
		name: {
			type: GraphQLString,
			description: "",
		},
	},
	resolve,
};
