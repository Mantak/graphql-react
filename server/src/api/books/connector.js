import Book from './model';
import Tag from '../tags/model';

const connector = {
  setter: {
    create(obj) {
      return Book.create(obj)._id;
    },
  },
  getter: {
    all() {
      return Book.find({});
    },
    one(id) {
      return Book.find({_id: id});
    },
    allByAuthorId(id) {
      return Book.find({author_ids: id});
    },
  },
  relations: {
    tags(bookId) {
      return Tag.find({ type: 'book', type_id: bookId}).tags;
    },
  },
};

export default connector;
