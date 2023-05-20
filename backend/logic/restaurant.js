const { 
  findRestaurantsByBrandId,
  createRestaurant
} = require('../database/restaurant.js');
const { findUserById } = require('../database/user.js');
// "restaurant" : {
//   "numberOfDeliveries":"deliveries done today",
//   "activeUsers": "list of active users",
//   "name": "{ type: String, required: true }",
//   "address": "{ type: String, required: true }",
//   "city": "{ type: String, required: true }",
//   "postcode": "{ type: String, required: true }",
//   "creatorName": "{ type: String, required: true }",
//   "creationName": "{ type: Date, default: Date.now }"
// }

class Restaurant {
  static async init(brand) {
    return await findRestaurantsByBrandId(brand);
  }

  static async post(restaurant) {
    const user = await findUserById(restaurant.creatorId);
    restaurant.creatorName = user.name;
    return await createRestaurant(restaurant);
  }

  static async isFirstRestaurant(brand) {
    const restaurants = await findRestaurantsByBrandId(brand);
    return restaurants.length === 1;
  }

}

module.exports = Restaurant;