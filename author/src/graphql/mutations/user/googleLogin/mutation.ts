import { 
  GraphQLObjectType, 
  GraphQLString
} from 'graphql';
import googleLoginResolve from './resolve.js';

const googleLoginType = new GraphQLObjectType({
  name: "GoogleLoginType",
  description: "",
  fields: {
    message: {
			type: GraphQLString,
		},
		access_token: {
      type: GraphQLString,
		},
  }
});

const googleLoginArgs = {
  google_token: {
    type: GraphQLString,
		description: "",
  }
}

export default {
  type: googleLoginType,
  args: googleLoginArgs,
  resolve: googleLoginResolve
}
