const { Schema } = require('mongoose');

const brandSchema = new Schema({
  name: { type: String, required: true, unique: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = brandSchema;
