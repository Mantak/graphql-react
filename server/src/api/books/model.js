import mongoose from 'mongoose';

const _schema = new mongoose.Schema({
  author_ids: { type: [String], required: true },
  title: { type: String, required: true },
  cover: { type: String },
  catalog: { type: [{}] },
});

const _Model = mongoose.model('Book', _schema);

export default _Model;
