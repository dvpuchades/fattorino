const {
  findRecentOrActiveDeliveries,
  createDelivery,
  updateDelivery,
  deleteDelivery
} = require('../database/delivery.js');
const { findUserById } = require('../database/user');
const { findRestaurantById } = require('../database/restaurant');

// "delivery": {
//   "customerName": "{ type: String, required: true }",
//   "customerPhone": "{ type: String, required: true }",
//   "address": "{ type: String, required: true }",
//   "city": "{ type: String, required: true }",
//   "postcode": "{ type: String, required: true }",
//   "amount": "{ type: Number, required: true }",
//   "status": "{ type: String, required: true }",
//   "initTime": "{ type: Date, default: Date.now }",
//   "readyTime": "{ type: Date }",
//   "departureTime": "{ type: Date }",
//   "endTime": "{ type: Date }",
//   "uploadUser": "{ type: Schema.Types.ObjectId, ref: 'User', required: true }",
//   "cooker": "{ type: Schema.Types.ObjectId, ref: 'User' }",
//   "courier": "{ type: Schema.Types.ObjectId, ref: 'User' }",
//   "restaurant": "{ type: Schema.Types.ObjectId, ref: 'Restaurant', required: true }",

//   "suggestedTrip": "id to trip"
// }

const getNamesByIds = async (delivery) => {
  const restaurant = await findRestaurantById(delivery.restaurant);
  delivery.restaurant = restaurant.name;
  const uploadUser = await findUserById(delivery.uploadUser);
  delivery.uploadUser = uploadUser.name;
  if (delivery.cooker) {
    const cooker = await findUserById(delivery.cooker);
    delivery.cooker = cooker.name;
  }
  if (delivery.courier) {
    const courier = await findUserById(delivery.courier);
    delivery.courier = courier.name;
  }
  return delivery;
}

class Delivery {
  static async init(brand) {
    // TODO: Suggest a trip
    const deliveries = await findRecentOrActiveDeliveries(brand);
    return Promise.all(deliveries.map(delivery => getNamesByIds(delivery)));
  }

  static async post(delivery) {
    // TODO: Suggest a trip
    delivery = await createDelivery(delivery);
    return await getNamesByIds(delivery);
  }

  static async update(delivery) {
    return await updateDelivery(delivery);
  }

  static async delete({_id}) {
    await deleteDelivery(_id);
    return { _id };
  }
}

module.exports = Delivery;