import { makeExecutableSchema } from 'graphql-tools';
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import userTypes from './api/users/typeDefs';
import userResolvers from './api/users/resolvers';
import bookTypes from './api/books/typeDefs';
import bookResolvers from './api/books/resolvers';

const commonTypes = `
  type Error {
    key: String
    value: String
  }
  type Tag {
    id: String
    count: String
  }
`;

const typeDefs = mergeTypes([
  commonTypes,
  userTypes,
  bookTypes,
]);
const resolvers = mergeResolvers([
  userResolvers,
  bookResolvers,
]);

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
