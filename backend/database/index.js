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
  findLastEnrollmentByUser,
  findLastEnrollmentByUserAndBrand,
  findLastEnrollmentByUserAndRestaurant,
  findEnrolledUsersByBrand,
  updateLastEnrollment,
  closeLastEnrollment
} = require('./enrollment');
const {
  createDelivery,
  findDeliveryById,
  findRecentOrActiveDeliveries,
  findTodaysDeliveriesForCourier,
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
  findLastEnrollmentByUser,
  findLastEnrollmentByUserAndBrand,
  findLastEnrollmentByUserAndRestaurant,
  findEnrolledUsersByBrand,
  updateLastEnrollment,
  closeLastEnrollment,
  createDelivery,
  findDeliveryById,
  findRecentOrActiveDeliveries,
  findTodaysDeliveriesForCourier,
  updateDelivery,
  deleteDelivery
};