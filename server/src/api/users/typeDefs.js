const typeDefs = `
  # Auth type.
  type Auth {
    token: String
    errors: [Error]
  }

  # User type.
  type User {
    id: String!
    firstName: String!
    lastName: String!
    email: String!
    tags: [Tag]
    books: [Book]
  }

  # Query type.
  type Query {
    # Fetch a list of users.
    users: [User]!
  }

  type Mutation {
    # Sign up.
    signUp(firstName: String!, lastName: String!, email: String!, password: String!): Auth

    # Sign in.
    signIn(email: String!, password: String!): Auth
  }
`;

export default typeDefs;
