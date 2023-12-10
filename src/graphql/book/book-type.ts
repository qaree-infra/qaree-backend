import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLBoolean,
	GraphQLInt,
	GraphQLList,
  GraphQLFloat
} from "graphql";

const bookType = new GraphQLObjectType({
	name: "Book",
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
			type: new GraphQLList(GraphQLString),
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
		authorId: {
			type: GraphQLString,
			description: "",
		},
		sampleUrl: {
			type: GraphQLString,
			description: "",
		},
		coverUrl: {
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
    }
	},
});

export default bookType;
