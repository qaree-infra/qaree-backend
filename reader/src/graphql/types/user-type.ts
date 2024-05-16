import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import fileType from './file-type.js';

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
		avatar: {
      type: fileType,
    },
    bio: {
      type: GraphQLString,
    },
    updatedAt: {
      type: GraphQLString
    },
    createdAt: {
      type: GraphQLString
    },
    isFollowed: {
      type: GraphQLBoolean,
    }
	},
})

export default userType;
