import connector from './connector';
import userConnector from '../users/connector';

const resolvers = {
  Query: {
    books() {
      return connector.getter.getBooks();
    },
  },
  Mutation: {
    create(obj) {
      return connector.setter.create(obj);
    },
    update(id, obj) {
      return connector.setter.update(id, obj);
    },
    delete(id) {
      return connector.setter.delete(id);
    },
  },
  Book: {
    authors: (book) => userConnector.getter.getUsers(book.author_ids),
  },
};

export default resolvers;
