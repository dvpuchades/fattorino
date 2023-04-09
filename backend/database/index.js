const { createBrand, findBrandByCreator, findBrandById } = require('./brand');
const { connectToDatabase, closeDatabaseConnection } = require('./connection');
const { createUser, authenticateUser, findUserById } = require('./user');
const {
  createRestaurant,
  findRestaurantById,
  findRestaurantsByBrandId,
  deleteRestaurant
} = require('./restaurant');
const {
  createEnrollment,
  findLastEnrollmentByUserAndBrand,
  findLastEnrollmentByUserAndRestaurant,
  findEnrolledUsersByBrand,
  updateLastEnrollment
} = require('./enrollment');
const {
  createDelivery,
  findDeliveryById,
  findRecentOrActiveDeliveries,
  updateDelivery,
  deleteDelivery
} = require('./delivery');

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
  createUser,
  authenticateUser,
  findUserById,
  createBrand,
  findBrandByCreator,
  findBrandById,
  createRestaurant,
  findRestaurantById,
  findRestaurantsByBrandId,
  deleteRestaurant,
  createEnrollment,
  findLastEnrollmentByUserAndBrand,
  findLastEnrollmentByUserAndRestaurant,
  findEnrolledUsersByBrand,
  updateLastEnrollment,
  createDelivery,
  findDeliveryById,
  findRecentOrActiveDeliveries,
  updateDelivery,
  deleteDelivery
};