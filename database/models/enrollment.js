const { Schema, model } = require('mongoose');

const enrollmentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  position: { type: String, required: true },
  initTime: { type: Date, default: Date.now },
  endTime: { type: Date }
});

const Enrollment = model('Enrollment', enrollmentSchema);

module.exports = Enrollment;