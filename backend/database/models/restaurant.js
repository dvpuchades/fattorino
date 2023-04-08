const { Schema } = require('mongoose');

const restaurantSchema = new Schema({
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postcode: { type: String, required: true }
});

module.exports = restaurantSchema;
