const Restaurant = require('./models/restaurant.js');

async function createRestaurant({brand, name, address, city, postcode, creatorId, creatorName, creationDate}) {
  const restaurant = new Restaurant({brand, name, address, city, postcode, creatorId, creatorName, creationDate});
  const document = await restaurant.save();
  return document.toObject();
}

async function findRestaurantById(id) {
  const restaurant = await Restaurant.findById(id).lean();
  return restaurant;
}

async function findRestaurantsByBrandId(brandId) {
  const restaurants = await Restaurant.find({ brand: brandId }).lean();
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