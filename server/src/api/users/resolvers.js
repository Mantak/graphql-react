import connector from './connector';

const resolvers = {
  Query: {
    users() {
      return connector.getter.all();
    }
  },
  Mutation: {
    signUp(root, args) {
      const errors = [];

      return connector.Auth.signUp(args)
        .then(token => ({
          token,
          errors
        }))
        .catch((err) => {
          if (err.code && err.message) {
            errors.push({
              key: err.code,
              value: err.message
            });
            return { token: null, errors };
          }

          throw new Error(err);
        });
    },
    signIn(root, args) {
      const errors = [];

      return connector.Auth.signIn(args)
        .then(token => ({
          token,
          errors
        }))
        .catch((err) => {
          if (err.code && err.message) {
            errors.push({
              key: err.code,
              value: err.message
            });

            return { token: null, errors };
          }

          throw new Error(err);
        });
    }
  },
  User: {
    tags:  (user) => connector.relations.tags(user.id),
    books: (user) => connector.relations.books(user.id),
  },
};

export default resolvers;
