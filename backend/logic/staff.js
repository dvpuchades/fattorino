const { findBrandById } = require('../database/brand');
const { findTodaysDeliveriesForCourier } = require('../database/delivery');
const { 
  createEnrollment,
  findEnrolledUsersByBrand,
  findLastEnrollmentByUserAndRestaurant,
  findLastEnrollmentByUser,
  closeLastEnrollment
} = require('../database/enrollment.js');
const { findRestaurantById } = require('../database/restaurant');
const { findUserById } = require('../database/user');

// "staff" : {
//   "_id": "id",
//   "name": "{ type: String, required: true }",
//   "position": "{ type: String, required: true }",
//   "restaurant": "{ type: Schema.Types.ObjectId, ref: 'Restaurant', required: true }",
//   "currentTrip": "{ type: Schema.Types.ObjectId, ref: 'Trip' }",
//   "phone": "{ type: String, required: true }",

//   "numberOfDeliveries": "deliveries done today",
//   "balance": " cash got today"
// }

class Staff {
  static async init(brand) {
    const enrollments = await findEnrolledUsersByBrand(brand);
    const staff = [];
    for (const enrollment of enrollments) {
      const user = await findUserById(enrollment.user);
      user.position = enrollment.position;
      const restaurant = await findRestaurantById(enrollment.restaurant);
      if (restaurant) user.restaurant = restaurant.name;
      const deliveries = await findTodaysDeliveriesForCourier(user._id);
      user.numberOfDeliveries = deliveries.length;
      user.balance = deliveries.reduce((acc, cur) => acc + cur.amount, 0);
      const unshipped = deliveries.filter(delivery => delivery.status !== 'shipped');
      user.currentTrip = {
        initTime: new Date(Math.min(
          ...unshipped.map((delivery) => delivery.departureTime)
        )),
        deliveries: unshipped
      }
      staff.push(user);
    };
    return staff;
  }

  static async post({ user, restaurant, brand }) {
    const composeUser = async (user, enrollment) => {
      user.position = enrollment.position;
      if (enrollment.restaurant) {
        const restaurant = await findRestaurantById(enrollment.restaurant);
        user.restaurant = restaurant.name;
      }
      user.brand = enrollment.brand;
      const deliveries = await findTodaysDeliveriesForCourier(user._id);
      user.numberOfDeliveries = deliveries.length;
      user.balance = deliveries.reduce((acc, cur) => acc + cur.amount, 0);
      const unshipped = deliveries.filter(delivery => delivery.status !== 'shipped');
      user.currentTrip = {
        initTime: new Date(Math.min(
          ...unshipped.map((delivery) => delivery.departureTime)
        )),
        deliveries: unshipped
      }
      return user;
    };
    const userObject = await findUserById(user);
    let enrollment;
    if (restaurant) {
      enrollment = await findLastEnrollmentByUserAndRestaurant(user, restaurant);
    }
    if (enrollment) {
       restaurant = restaurant || enrollment.restaurant;
      if (enrollment.endTime) {
        const newEnrollment = await createEnrollment({
          user,
          restaurant,
          position: enrollment.position,
          brand: enrollment.brand
        });
        return await composeUser(userObject, enrollment);
      }
      else {
        return await composeUser(userObject, enrollment);
      }
    }
    else {
      if (!brand) {
        const restaurantObject = await findRestaurantById(restaurant);
        brand = restaurantObject.brand;
      }
      const { creator } = await findBrandById(brand);
      const isManager = creator == userObject._id.toString();
      const enrollment = await createEnrollment({
        user: user,
        position: isManager ? 'admin' : 'staff',
        brand
      });
      return await composeUser(userObject, enrollment);
    }
  }

  // update only for a disconnect from a restaurant at the moment
  static async update({ _id, restaurant }) {
    const previousEnrollment = await closeLastEnrollment(_id);
    const enrollment = await createEnrollment({
      user: _id,
      brand: previousEnrollment.brand,
      position: 'staff'
    });
    const user = await findUserById(_id);
    return await composeUser(user, enrollment);
  }


  static async delete({_id}) {
    await closeLastEnrollment(_id);
    return _id;
  }
}

module.exports = Staff;