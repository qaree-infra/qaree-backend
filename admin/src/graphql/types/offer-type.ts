import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLInt,
	GraphQLString,
} from "graphql";
import bookInfoType from "./book-type.js";

const offerType = new GraphQLObjectType({
	name: "OfferType",
	description: "This is book offer type",
	fields: {
		_id: {
			type: GraphQLID,
			description: "",
		},
		percent: {
			type: GraphQLInt,
			description: "",
		},
		expireAt: {
			type: GraphQLString,
			description: "",
		},
		book: {
			type: bookInfoType,
			description: "",
		},
		createdAt: {
			type: GraphQLString,
			description: "",
		},
		updatedAt: {
			type: GraphQLString,
			description: "",
		},
	},
});

export default offerType;
