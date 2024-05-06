import { GraphQLString } from "graphql";
import userType from "../../../types/user-type.js";
import resolve from "./resolve.js";

export default {
	type: userType,
	args: {
		userId: {
			type: GraphQLString,
			description: "The id of the user",
		},
	},
	resolve,
};
