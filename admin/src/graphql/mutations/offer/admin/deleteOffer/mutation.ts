import { GraphQLBoolean, GraphQLObjectType, GraphQLScalarType, GraphQLString } from 'graphql';
import resolve from './resolve.js';

const deleteOfferType = new GraphQLObjectType({
  name: "DeleteOfferType",
  description: "this is delete offer type",
  fields: {
    message: {
      type: GraphQLString,
      description: ""
    },
    success: {
      type: GraphQLBoolean,
      description: ""
    }
  }
})

const args = {
  id: {
    type: GraphQLString,
    description: ""
  }
}

export default {
  type: deleteOfferType,
  args,
  resolve,
}
