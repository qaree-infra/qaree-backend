import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
} from 'graphql';
import userType from "./user/user-type.js";

const queryType = new GraphQLObjectType({
	name: "Query",
	description: "This is the query type",
	fields: {
		users: {
			type: new GraphQLList(userType),
			description: "This is the list of users returned",
			resolve: (_, args) => {
				return [{}]; // use user module to get users
			},
		},
		userById: {
			type: userType,
			description: "This is a single user returned",
			args: {
				id: {
					type: GraphQLID,
          description: ''
				},
			},
			resolve: (_, args) => {
				return [{}]; // use user module to get user by id
			},
		},
	},
});

export default queryType;
