const Enrollment = require('./models/enrollment');

// Create a new enrollment
async function createEnrollment({user, brand, restaurant, position}) {
  const enrollment = new Enrollment({
    user,
    brand,
    restaurant,
    position
  });
  await enrollment.save();
  return enrollment;
}

// Find an enrollment by user
async function findLastEnrollmentByUser(userId) {
  const enrollment = await Enrollment.findOne({
    user: userId
  }).sort({initTime: -1});
  return enrollment;
}

// Find an enrollment by user and brand  
async function findLastEnrollmentByUserAndBrand(userId, brandId) {
  const enrollment = await Enrollment.findOne({
    user: userId,
    brand: brandId,
  }).sort({initTime: -1});
  return enrollment;
}

// Find an enrollment by user and restaurant  
async function findLastEnrollmentByUserAndRestaurant(userId, restaurantId) {
  const enrollment = await Enrollment.findOne({
    user: userId,
    restaurant: restaurantId
  }).sort({initTime: -1});
  return enrollment;
}

// Find enrolled users by brand
async function findEnrolledUsersByBrand(brandId) {
  const enrollments = await Enrollment.find({
    brand: brandId,
    endTime: { $exists: false }
  }).sort({initTime: -1});
  return enrollments;
}

// Find enrolled users by restaurant
async function findEnrolledUsersByRestaurant(restaurantId) {
  const enrollments = await Enrollment.find({
    restaurant: restaurantId,
    endTime: { $exists: false }
  }).sort({initTime: -1});
  return enrollments;
}

// Update an enrollment
async function updateLastEnrollment(user, brand, update) {
  const enrollment = await findLastEnrollmentByUserAndBrand(user, brand);
  if (enrollment) {
    Object.assign(enrollment, update);
    await enrollment.save();
  }
  return enrollment;
}

// deactivate very last enrollment for user
async function closeLastEnrollment(user) {
  const enrollment = await Enrollment.findOne({
    user: user,
    endTime: { $exists: false }
  }).sort({initTime: -1});
  if (enrollment) {
    enrollment.endTime = Date.now();
    await enrollment.save();
  }
  return enrollment;
}

module.exports = {
  createEnrollment,
  findLastEnrollmentByUser,
  findLastEnrollmentByUserAndBrand,
  findLastEnrollmentByUserAndRestaurant,
  findEnrolledUsersByBrand,
  findEnrolledUsersByRestaurant,
  updateLastEnrollment,
  closeLastEnrollment
};