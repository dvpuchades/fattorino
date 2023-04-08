const mongoose = require('mongoose');
const restaurantSchema = require('./models/restaurant');

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

async function createRestaurant({brand, name, address, city, postcode}) {
  const restaurant = new Restaurant({brand, name, address, city, postcode});
  return restaurant.save();
}

async function findRestaurantById(id) {
  const restaurant = await Restaurant.findById(id);
  return restaurant;
}

async function findRestaurantsByBrandId(brandId) {
  const restaurants = await Restaurant.find({ brand: brandId });
  return restaurants;
}

async function deleteRestaurant(id) {
  return Restaurant.findByIdAndDelete(id);
}

module.exports = {
  createRestaurant,
  findRestaurantById,
  findRestaurantsByBrandId,
  deleteRestaurant
};