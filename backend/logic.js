const {
  createUser,
  authenticateUser,
  findUserById
} = require('./database/user');
const {
  createBrand,
  findBrandByCreator,
  findBrandById
} = require('./database/brand');
const { findLastEnrollmentByUserAndBrand, updateLastEnrollment } = require('./database/enrollment');
const { findRestaurantById } = require('./database/restaurant');
const { findRecentOrActiveDeliveries } = require('./database/delivery');

function register(user, onSuccess, onFail) {
  createUser(user.email, user.name, user.password)
    .then(onSuccess)
    .catch(onFail);
}

function auth(user, onSuccess, onFail) {
  authenticateUser(user.email, user.password)
    .then((user) => {
      findBrandByCreator(user._id)
        .then((brand) => {
          if (brand) {
            user.brand = brand;
          }
          onSuccess(user);
        })
    })
    .catch(onFail);
}

function createBrand(brand, onSuccess, onFail) {
  createBrand(brand.name, brand.creator)
    .then(onSuccess)
    .catch(onFail);
}

function createRestaurant(restaurant, onSuccess, onFail) {
  createRestaurant(restaurant.name, restaurant.brand)
    .then(onSuccess)
    .catch(onFail);
}

function connectToRestaurant({user, brand, restaurant}, onSuccess, onFail) {
  const firstEnrollment = () => {
    findRestaurantById(restaurant)
      .then((foundRestaurant) => {
        if (foundRestaurant.brand !== brand) {
          onFail('Brand and restaurant do not match');
        }
        else {
          createEnrollment({
            user: user._id,
            brand,
            restaurant,
            position: 'staff',
            initTime: new Date()
          })
          onSuccess({brand, restaurant, position: 'staff'});
        }
      })
      .catch(onFail);
  };
  findLastEnrollmentByUserAndBrand(user._id, brand)
    .then((enrollment) => {
      if (enrollment) {
        if (enrollment.position === 'admin') {
          if (enrollment.endTime) {
            createEnrollment({
              user: user._id,
              brand,
              restaurant,
              position: 'admin',
              initTime: new Date()
            })
          }
          onSuccess({brand, position});
        }
        else {
          findLastEnrollmentByUserAndRestaurant(user._id, restaurant)
            .then((enrollment) => {
              if (enrollment) {
                if (enrollment.brand !== brand) {
                  onFail('Brand and restaurant do not match');
                }
                else {
                  if (enrollment.endTime) {
                    createEnrollment({
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
    .catch(onFail);
}

function disconnectFromRestaurant({user, restaurant}, onSuccess, onFail) {
  updateLastEnrollment(user._id, restaurant, {endTime: new Date()})
    .then((enrollment) => {
      if (!enrollment) {
        onFail('User is not connected to restaurant');
      }
      else {
        onSuccess();
      }
    })
    .catch(onFail);
}

function initializeClient({user, brand}, onSuccess, onFail) {
  const deliveries = findRecentOrActiveDeliveries(brand).catch(onFail);
  const restaurants = findRestaurantsByBrandId(brand).catch(onFail);
  const staff = findEnrolledUsersByBrand(brand)
    .then((users) => {
      users.map(user => findUserById(user).catch(onFail));
      return Promise.all(users);
    })
    .catch(onFail);
  Promise.all([deliveries, restaurants, staff]);
  return {deliveries, restaurants, staff};
}

function createDelivery(delivery, onSuccess, onFail) {
  return createDelivery(delivery)
    .then(onSuccess)
    .catch(onFail);
}

function updateDelivery(delivery, onSuccess, onFail) {
  return updateDelivery(delivery)
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
  createDelivery,
  updateDelivery
};