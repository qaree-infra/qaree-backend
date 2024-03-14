import { GraphQLString } from "graphql";
import resolve from "./resolve.js";
import reviewBookType from "../../../types/reviewBook-type.js";

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
