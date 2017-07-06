const typeDefs = `
  ################################ Input types #################################
  input BookInput{
    author_ids: [String]
    title: String
  }
  ################################ Model types #################################
  type Book {
    id: String!
    authors: [User]!
    title: String!
    tags: [String]
  }
  ################################ Query types #################################
  type Query {
    books: [Book]!
  }
  ################################ Mutation types ##############################
  type Mutation {
    create(obj: BookInput!): String
    update(id: String!, obj: BookInput!): String
    delete(id: String!): String
  }
`;

export default typeDefs;
