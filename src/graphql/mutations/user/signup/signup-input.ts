import {
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql';

const signupInputs = new GraphQLInputObjectType({
  name: "SignUpInput",
  description: "",
  fields: {
    name: {
      type: GraphQLString,
      description: '',
    },
    email: {
      type: GraphQLString,
      description: '',
    },
    password: {
      type: GraphQLString,
      description: '',
    },
  }
})

export default signupInputs;
