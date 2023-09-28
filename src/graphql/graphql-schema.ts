import {
	GraphQLSchema,
} from "graphql";
import queryType from './query-type.js';
import mutationType from './mutation-type.js';

const schema = new GraphQLSchema({
	query: queryType,
  mutation: mutationType,
});

export default schema;
