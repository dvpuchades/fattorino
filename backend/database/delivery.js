const mongoose = require('mongoose');
const deliverySchema = require('./models/delivery');

const Delivery = mongoose.model('Delivery', deliverySchema);

// Create a new delivery
async function createDelivery(delivery) {
  const newDelivery = new Delivery(delivery);
  return newDelivery.save();
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

  const recentDeliveries = await Delivery.find({
    uploadTime: { $gte: fourHoursAgo },
    brand
  }).exec();

  const activeDeliveries = await Delivery.find({
    status: { $ne: 'shipped' }
  }).exec();

  return [...recentDeliveries, ...activeDeliveries];
}

// Update delivery properties if they are defined in the input object
async function updateDelivery({ id, status, endTime, cooker, courier, readyTime, departureTime }) {
  const delivery = await Delivery.findById(id);
  if (!delivery) {
    throw new Error('Delivery not found');
  }
  if (status !== undefined) {
    delivery.status = status;
  }
  if (endTime !== undefined) {
    delivery.endTime = endTime;
  }
  if (cooker !== undefined) {
    delivery.cooker = cooker;
  }
  if (courier !== undefined) {
    delivery.courier = courier;
  }
  if (readyTime !== undefined) {
    delivery.readyTime = readyTime;
  }
  if (departureTime !== undefined) {
    delivery.departureTime = departureTime;
  }
  await delivery.save();
  return delivery;
}


// Delete a delivery
async function deleteDelivery(id) {
  return Delivery.findByIdAndDelete(id);
}

module.exports = {
  createDelivery,
  findDeliveryById,
  findRecentOrActiveDeliveries,
  updateDelivery,
  deleteDelivery
};