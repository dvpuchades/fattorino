const { 
  findRestaurantsByBrandId,
  createRestaurant
} = require('../database/restaurant.js');
const { findUserById } = require('../database/user.js');
const { findShippedTodayDeliveriesForRestaurant } = require('../database/delivery.js');
const { findEnrolledUsersByRestaurant } = require('../database/enrollment.js');

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

const composeRestaurant = async (restaurant /*restaurant as given by database*/) => {
  restaurant.numberOfDeliveries = await findShippedTodayDeliveriesForRestaurant(restaurant._id).length;
  if (typeof restaurant.numberOfDeliveries === 'undefined') {
    restaurant.numberOfDeliveries = 0;
  }
  restaurant.activeUsers = await findEnrolledUsersByRestaurant(restaurant._id).length;
  if (typeof restaurant.activeUsers === 'undefined') {
    restaurant.activeUsers = 0;
  }
  return restaurant;
};

class Restaurant {
  static async init(brand) {
    const restaurants = await findRestaurantsByBrandId(brand);
    return await Promise.all(restaurants.map(composeRestaurant));
  }

  static async post(restaurant) {
    const user = await findUserById(restaurant.creatorId);
    restaurant.creatorName = user.name;
    const createdRestaurant = await createRestaurant(restaurant);
    return await composeRestaurant(createdRestaurant);
  }

  static async isFirstRestaurant(brand) {
    const restaurants = await findRestaurantsByBrandId(brand);
    return restaurants.length === 1;
  }

}

module.exports = Restaurant;