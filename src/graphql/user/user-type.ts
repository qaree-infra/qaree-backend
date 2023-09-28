import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
} from 'graphql';

const userType = new GraphQLObjectType({
	name: "User",
	description: "This is the user type",
	fields: {
    _id: {
      type: GraphQLID
    },
		name: {
      type: GraphQLString,
    },
		email: {
      type: GraphQLString,
    },
		password: {
      type: GraphQLString,
    },
		avatar: {
      type: GraphQLString,
    },
    updatedAt: {
      type: GraphQLString
    },
    createdAt: {
      type: GraphQLString
    }
	},
})

export default userType;
