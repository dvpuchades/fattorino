const { Schema, model } = require('mongoose');

const restaurantSchema = new Schema({
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postcode: { type: String, required: true },
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  creatorName: { type: String, required: true },
  creationDate: { type: Date, default: Date.now }
});

const Restaurant = model('Restaurant', restaurantSchema);

module.exports = Restaurant;