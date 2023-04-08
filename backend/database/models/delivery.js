const { Schema } = require('mongoose');

const deliverySchema = new Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postcode: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  initTime: { type: Date, required: true },
  readyTime: { type: Date },
  departureTime: { type: Date },
  endTime: { type: Date },
  uploadUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cooker: { type: Schema.Types.ObjectId, ref: 'User' },
  courier: { type: Schema.Types.ObjectId, ref: 'User' },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true }
});

module.exports = deliverySchema;
