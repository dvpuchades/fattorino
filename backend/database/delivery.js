const mongoose = require('mongoose');
const deliverySchema = require('./models/delivery');

const Delivery = mongoose.model('Delivery', deliverySchema);

// Create a new delivery
async function createDelivery(delivery) {
  const newDelivery = new Delivery(delivery);
  const document = await newDelivery.save();
  return document.toObject();
}

// Find delivery by id
async function findDeliveryById(id) {
  const delivery = await Delivery.findById(id);
  return delivery;
}

// Find deliveries that are either recent or active
async function findRecentOrActiveDeliveries(brand) {
  const now = new Date();
  const fourHoursAgo = new Date(now - 4 * 60 * 60 * 1000); // 4 hours ago

  const deliveries = await Delivery.find({
    $or: [
      { initTime: { $gte: fourHoursAgo } },
      { status: { $ne: 'shipped' } }
    ],
    brand
  }).lean();

  return deliveries;
}

// Find today's deliveries for courier
async function findTodaysDeliveriesForCourier(courier) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const deliveries = await Delivery.find({
    courier,
    initTime: { $gte: today, $lt: tomorrow }
  }).lean();

  return deliveries;
}

// Update delivery properties if they are defined in the input object
async function updateDelivery({ _id, status, endTime, cooker, courier, readyTime, departureTime }) {
  const update = { status, endTime, cooker, courier, readyTime, departureTime };
  const delivery = await Delivery.findOneAndUpdate(
    { _id },
    update,
    { new: true }
  ).lean();
  return delivery;
}


// Delete a delivery
async function deleteDelivery(_id) {
  return Delivery.findByIdAndDelete(_id);
}

module.exports = {
  createDelivery,
  findDeliveryById,
  findRecentOrActiveDeliveries,
  findTodaysDeliveriesForCourier,
  updateDelivery,
  deleteDelivery
};