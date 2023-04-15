const database = require('./database');
const { findLastEnrollmentByUserAndBrand, updateLastEnrollment } = require('./database/enrollment');
const { findRestaurantById } = require('./database/restaurant');
const { findRecentOrActiveDeliveries } = require('./database/delivery');

database.connectToDatabase();

function register(user, onSuccess, onFail) {
  database.createUser(user.email, user.name, user.password)
    .then(onSuccess)
    .catch(onFail);
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
    .catch(onFail);
}

function createBrand(brand, onSuccess, onFail) {
  database.createBrand(brand.name, brand.creator)
    .then(onSuccess)
    .catch(onFail);
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
        if (foundRestaurant.brand !== brand) {
          onFail('Brand and restaurant do not match');
        }
        else {
          database.createEnrollment({
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
                  position: 'admin',
                  initTime: new Date()
                })
              }
              onSuccess({brand, position});
            }
            else {
              database.findLastEnrollmentByUserAndRestaurant(user._id, restaurant)
                .then((enrollment) => {
                  if (enrollment) {
                    if (enrollment.brand !== brand) {
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
        .catch(onFail);
    })
    .catch(onFail);
}

function disconnectFromRestaurant({user, restaurant}, onSuccess, onFail) {
  database.updateLastEnrollment(user._id, restaurant, {endTime: new Date()})
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

function initializeClient({brand}, onSuccess, onFail) {
  const deliveries = database.findRecentOrActiveDeliveries(brand);
  const restaurants = database.findRestaurantsByBrandId(brand);
  const staff = database.findEnrolledUsersByBrand(brand)
    .then((users) => {
      const promises = users.map(user => findUserById(user).catch(onFail));
      return Promise.all(promises);
    });
  Promise.all([deliveries, restaurants, staff])
    .then(([deliveries, restaurants, staff]) => onSuccess({deliveries, restaurants, staff}))
    .catch(onFail);
}

function createDelivery(delivery, onSuccess, onFail) {
  return database.createDelivery(delivery)
    .then(onSuccess)
    .catch(onFail);
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
  createDelivery,
  updateDelivery
};