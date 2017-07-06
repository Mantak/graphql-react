import mongoose from 'mongoose';

const _schema = new mongoose.Schema({
  type:    { type: String, required: true },
  type_id: { type: String, required: true },
  user_id: { type: String, required: true },
  tags:    { type: [String], required: true },
});

const _Model = mongoose.model('Tag', _schema);

export default _Model;
