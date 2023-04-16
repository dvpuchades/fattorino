const Enrollment = require('./models/enrollment');

// Create a new enrollment
async function createEnrollment({user, brand, restaurant, position, initTime}) {
  const enrollment = new Enrollment({
    user,
    brand,
    restaurant,
    position,
    initTime
  });
  await enrollment.save();
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
    restaurant: restaurantId,
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

// Update an enrollment
async function updateLastEnrollment(user, restaurant, update) {
  const enrollment = await findLastEnrollmentByUserAndRestaurant(user, restaurant);
  if (enrollment) {
    Object.assign(enrollment, update);
    await enrollment.save();
  }
  return enrollment;
}

module.exports = {
  createEnrollment,
  findLastEnrollmentByUserAndBrand,
  findLastEnrollmentByUserAndRestaurant,
  findEnrolledUsersByBrand,
  updateLastEnrollment
};