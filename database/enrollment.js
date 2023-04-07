const Enrollment = require('./models/enrollment');

// Create a new enrollment
async function createEnrollment({user, restaurant, position, initTime}) {
  const enrollment = new Enrollment({
    user,
    restaurant,
    position,
    initTime
  });
  await enrollment.save();
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

// Update an enrollment
async function updateLastEnrollment(user, restaurant, update) {
  const enrollment = await findLastEnrollmentByUserAndRestaurant(user, restaurant);
  Object.assign(enrollment, update);
  await enrollment.save();
  return enrollment;
}

module.exports = {
  createEnrollment,
  findLastEnrollmentByUserAndRestaurant,
  updateLastEnrollment
};