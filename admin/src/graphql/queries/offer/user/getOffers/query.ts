import { GraphQLList, GraphQLObjectType, GraphQLInt, GraphQLString } from 'graphql'
import resolve from './resolve.js'
import offerType from '../../../../types/offer-type.js'

const getAllOffersType = new GraphQLObjectType({
  name: "GetAllOffers",
  description: "this is get all offers",
  fields: {
    offers: {
      type: new GraphQLList(offerType),
      description: ""
    },
    currentPage: {
			type: GraphQLInt,
			description: "",
		},
		numberOfPages: {
			type: GraphQLInt,
			description: "",
		},
		total: {
			type: GraphQLInt,
			description: "",
		},
  }
})

const args = {
  page: {
    type: GraphQLInt,
    description: "",
  },
  limit: {
    type: GraphQLInt,
    description: "",
  },
  sort: {
    type: GraphQLString,
    description: "",
  }
}

export default {
  type: getAllOffersType,
  args,
  resolve,
}
