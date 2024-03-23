import { GraphQLString } from "graphql";
import activityType from "../activity-type.js";
import resolve from "./resolve.js";

const args = {
	bookId: {
		type: GraphQLString,
		description: "",
	},
};

export default {
	type: activityType,
	args,
	resolve,
};
