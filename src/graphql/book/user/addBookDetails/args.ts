import {
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLList,
  GraphQLFloat,
} from "graphql";

const bookDetailsInputs = {
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
	language: {
    type: GraphQLString,
    description: "",
	},
	publishingRights: {
    type: GraphQLBoolean,
    description: "",
	},
	categories: {
    type: new GraphQLList(GraphQLString),
    description: "",
	},
  price: {
    type: GraphQLFloat,
    description: "",
  }
};

export default bookDetailsInputs;
