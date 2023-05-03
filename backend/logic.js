const database = require('./database');
const { findLastEnrollmentByUserAndBrand, updateLastEnrollment } = require('./database/enrollment');
const { findRestaurantById } = require('./database/restaurant');
const { findRecentOrActiveDeliveries } = require('./database/delivery');

database.connectToDatabase();

function register(user, onSuccess, onFail) {
  console.log(user)
  database.createUser(user)
    .then(onSuccess)
    .catch(error => console.log(error));
}

function auth({email, password}, onSuccess, onFail) {
  database.authenticateUser(email, password)
    .then((user) => {
      database.findBrandByCreator(user._id)
        .then((brand) => {
          if (brand) {
            user.brand = brand;
          }
          onSuccess(user);
        })
    })
    .catch(error => onFail(error));
}

function createBrand(brand, onSuccess, onFail) {
  database.createBrand(brand.name, brand.creator)
    .then((newBrand) => {
      database.createEnrollment({
        user: brand.creator,
        brand: newBrand._id,
        position: 'admin'
      })
      onSuccess(newBrand)
    })
    .catch(error => onFail(error));
}

function createRestaurant(restaurant, onSuccess, onFail) {
  database.createRestaurant(restaurant)
    .then(onSuccess)
    .catch(onFail);
}

function connectToRestaurant({user, restaurant}, onSuccess, onFail) {
  const firstEnrollment = () => {
    database.findRestaurantById(restaurant)
      .then((foundRestaurant) => {
        database.createEnrollment({
          user: user._id,
          brand: foundRestaurant.brand,
          restaurant,
          position: 'staff'
        })
          .then(() => {
            onSuccess({brand: foundRestaurant.brand, restaurant, position: "staff"})
          })
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error));
  };
  database.findRestaurantById(restaurant)
    .then(({brand}) => {
      database.findLastEnrollmentByUserAndBrand(user._id, brand)
        .then((enrollment) => {
          if (enrollment) {
            if (enrollment.position === 'admin') {
              if (enrollment.endTime) {
                database.createEnrollment({
                  user: user._id,
                  brand,
                  restaurant,
                  position: 'admin'
                })
              }
              onSuccess({brand, position});
            }
            else {
              database.findLastEnrollmentByUserAndRestaurant(user._id, restaurant)
                .then((enrollment) => {
                  if (enrollment) {
                    if (!enrollment.brand.equals(brand)) {
                      onFail('Brand and restaurant do not match');
                    }
                    else {
                      if (enrollment.endTime) {
                        database.createEnrollment({
                          user: user._id,
                          brand,
                          restaurant,
                          position: enrollment.position,
                          initTime: new Date()
                        })
                      }
                      onSuccess({brand, position: enrollment.position});
                    }
                  }
                  else {
                    firstEnrollment();
                  }
                })
                .catch(onFail);
            }
          }
          else {
            firstEnrollment();
          }
        })
        .catch((error) => onFail(error));
    })
    .catch((error) => onFail(error));
}

function setLastEnrollmentEndTime(user, brand) {
  return database.updateLastEnrollment(user, brand, {endTime: new Date()})
    .then((enrollment) => {
      if (!enrollment) {
        return Promise.reject('User is not connected to restaurant');
      }
      else {
        return Promise.resolve();
      }
    })
    .catch((error) => Promise.reject(error));
}

function disconnectFromRestaurant({user, brand}, onSuccess, onFail) {
  setLastEnrollmentEndTime(user, brand)
    .then(() => onSuccess())
    .catch((error) => onFail(error));
}

function disconnect(userId) {
  return database.closeLastEnrollment(userId);
}

async function getUser(userId) {
  const user = await database.findUserById(userId);
  const deliveries = await database.findTodaysDeliveriesForCourier(userId);
  const currentDeliveries = deliveries.filter((delivery) => delivery.status !== 'shipped');
  if(currentDeliveries.length > 0) {
    const initTime = new Date(Math.min(
      ...currentDeliveries.map((delivery) => delivery.departureTime)
    ));
    user.currentTrip = {
      initTime,
      deliveries: currentDeliveries
    };
  }
  user.numberOfDeliveries = deliveries.length;
  user.balance = currentDeliveries.reduce(
    (accumulator, delivery) => accumulator + delivery.amount, 0);
  return user;
}

function initializeClient({brand}, onSuccess, onFail) {
  const deliveries = database.findRecentOrActiveDeliveries(brand);
  const restaurants = database.findRestaurantsByBrandId(brand);
  const staff = database.findEnrolledUsersByBrand(brand)
    .then((enrollments) => {
      const promises = enrollments.map(
        (enrollment) => getUser(enrollment.user)
          .then((user) => {
            user.restaurant = enrollment.restaurant;
            user.position = enrollment.position;
            return user;
          })
      );
      return Promise.all(promises).catch((error) => console.log(error));
    });
  Promise.all([deliveries, restaurants, staff])
    .then(([deliveries, restaurants, staff]) => {
      onSuccess({deliveries, restaurants, staff})
    })
    .catch((error) => console.log(error));
}

function findEnrolledUsersByBrand(brand) {
  return database.findEnrolledUsersByBrand(brand);
}

function findEnrolledExMatesForUser(user, onSuccess, onFail) {
  database.findLastEnrollmentByUser(user)
    .then(({brand}) => {
      onSuccess(database.findEnrolledUsersByBrand(brand));
    })
    .catch((error) => onFail(error));
}

function createDelivery(delivery, onSuccess, onFail) {
  return database.createDelivery(delivery)
    .then(onSuccess)
    .catch(error => {
      console.log(error);
      onFail(error);
    });
}

function updateDelivery(delivery, onSuccess, onFail) {
  return database.updateDelivery(delivery)
    .then(onSuccess)
    .catch(onFail);
}

module.exports = {
  register,
  auth,
  createBrand,
  createRestaurant,
  connectToRestaurant,
  disconnectFromRestaurant,
  initializeClient,
  findEnrolledUsersByBrand,
  findEnrolledExMatesForUser,
  createDelivery,
  updateDelivery,
  disconnect
};