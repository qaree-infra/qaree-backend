import {
	GraphQLSchema,
} from "graphql";
import queryType from './queries/query-type.js';
import mutationType from './mutations/mutation-type.js';

const schema = new GraphQLSchema({
	query: queryType,
  mutation: mutationType,
});

export default schema;
