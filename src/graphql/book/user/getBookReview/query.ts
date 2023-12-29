import { GraphQLString } from "graphql";
import resolve from "./resolve.js";
import { reviewBookType } from "../reviewBook/mutation.js";

const args = {
  reviewId: {
    type: GraphQLString,
    description: "",
  },
};

export default {
	type: reviewBookType,
	args,
	resolve,
};
