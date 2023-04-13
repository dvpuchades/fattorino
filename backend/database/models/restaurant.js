const { Schema, model } = require('mongoose');

const restaurantSchema = new Schema({
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postcode: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  created: { type: Date, default: Date.now }
});

const Restaurant = model('Restaurant', restaurantSchema);

module.exports = Restaurant;