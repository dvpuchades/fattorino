import React, { createContext, useState } from 'react';
import io from 'socket.io-client';
import { server } from '../environment.js';
const socket = io(server.uri);

const DataServiceContext = createContext();

const DataServiceContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [trips, setTrips] = useState([]);
  const [staff, setStaff] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [deliveryFilters, setDeliveryFilters] = useState(new Map());
  const [staffFilters, setStaffFilters] = useState(new Map());

  // sockets

  socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
  });
  
  socket.on('newDelivery', (data) => {
    console.log('New delivery:', data);
    if (data.created) {
      // dataService.createDelivery(data.delivery);
    } else {
      console.log('Error creating delivery:', data.error);
    }
  });
  
  socket.on('updateDelivery', (data) => {
    if (data.updated) {
      // dataService.updateDelivery(data.delivery);
    } else {
      console.log('Error updating delivery:', data.error);
    }
  });

  const register = async (user) => {
    const response = new Promise ((resolve, reject) => {
      socket.once('register', (response) => {
        if (response.registered) {
          setUser(response.user);
          resolve();
        } else {
          reject(response.error);
        }
      });
    });
    await socket.emit('register', {user});
    await response;
  }

  const authenticate = async ({email, password}) => {
    const response = new Promise((resolve, reject) => {
      socket.once('auth', (response) => {
        if (response.authenticated) {
          dataService.user = response.user;
          resolve();
        } else {
          reject(response.error);
        }
      });
    });
    const user = { email, password };
    await socket.emit('auth', {user});
    await response;
  }

  const createBrand = async (brand) => {
    const response = new Promise((resolve, reject) => {
      socket.once('createBrand', (response) => {
        if (response.created) {
          user.brand = response.brand;
          setUser(user);
          resolve();
        } else {
          reject(response.error);
        }
      });
    });
    await socket.emit('createBrand', {brand});
    await response;
  }

  const initializeClientPromise = new Promise((resolve, reject) => {
    socket.once('initializeClient', (response) => {
      console.log('Response: ', response);
      if (response.created || response.connected) {
        initialize(response.initialData);
        user.position = response.position;
        setUser(user);
        resolve();
      } else {
        reject(response.error);
      }
    });
  });

  const createRestaurant = async (restaurant) => {
    const response = initializeClientPromise;
    await socket.emit('createRestaurant', {restaurant});
    await response;
  }

  const connectToRestaurant = async (restaurant) => {
    const response = initializeClientPromise;
    await socket.emit('connectToRestaurant', {user, restaurant});
    await response;
  }

  const initialize = (data) => {
    const restaurantMap = new Map();
    const staffMap = new Map();

    const newRestaurants = data.restaurants;
    for (const r of newRestaurants) {
      restaurantMap.set(r._id, r.name);
    }

    const newStaff = data.staff.map(user => {
      user.restaurant = restaurantMap.get(user.restaurant);
      staffMap.set(user._id, user.name);
      return user;
    });

    const newDeliveries = data.deliveries.map(delivery => {
      delivery.restaurant = restaurantMap.get(delivery.restaurant);
      delivery.uploadUser = staffMap.get(delivery.uploadUser);
      delivery.cooker = staffMap.get(delivery.cooker);
      delivery.courier = staffMap.get(delivery.courier);
      return delivery;
    });

    setRestaurants(newRestaurants);
    setStaff(newStaff);
    setDeliveries(newDeliveries);
    setTrips(data.trips);
  };

  const createDelivery = (delivery) => {
    socket.emit('newDelivery', {delivery});
  };

  const updateDelivery = (delivery) => {
    const index = this.deliveries.findIndex(d => d._id === delivery._id);
    if (index !== -1) {
      this.deliveries[index] = delivery;
    }
    return (index !== -1);
  };

  const getDeliveryCities = () => {
    const cities = new Set();
    for (const d of this.deliveries) {
      cities.add(d.city);
    }
    return cities;
  };

  const getDeliveryPostcodes = () => {
    const postcodes = new Set();
    for (const d of this.deliveries) {
      postcodes.add(d.postcode);
    }
    return postcodes;
  };

  const getDeliveryCouriers = () => {
    const couriers = new Set();
    for (const d of this.deliveries) {
      couriers.add(d.courier);
    }
    couriers.delete(undefined);
    return couriers;
  };

  const addDeliveryFilter = (key, fn) => {
    this.deliveryFilters.set(key, fn);
  };

  const removeDeliveryFilter = (key) => {
    this.deliveryFilters.delete(key);
  };

  const getDeliveryFilters = () => {
    const filters = new Set;
    for (let [key, fn] of this.deliveryFilters) {
      filters.add(key.split('.')[0]);
    }
    return filters;
  };

  const addStaffFilter = (key, fn) => {
    this.staffFilters.set(key, fn);
  };

  const removeStaffFilter = (key) => {
    this.staffFilters.delete(key);
  };

  const getStaffFilters = () => {
    const filters = new Set;
    for (let [key, fn] of this.staffFilters) {
      filters.add(key.split('.')[0]);
    }
    return filters;
  };

  const contextValue = {
    user,
    deliveries,
    trips,
    staff,
    restaurants,
    deliveryFilters,
    staffFilters,
    initialize,
    subscribe,
    publish,
    getStaff,
    getDeliveries,
    createDelivery,
    updateDelivery,
    getDeliveryCities,
    getDeliveryPostcodes,
    getDeliveryCouriers,
    getTrips,
    addDeliveryFilter,
    removeDeliveryFilter,
    getDeliveryFilters,
    addStaffFilter,
    removeStaffFilter,
    getStaffFilters,
  };

  return (
    <DataServiceContext.Provider value={contextValue}>
      {children}
    </DataServiceContext.Provider>
  );
};

export { DataServiceContext, DataServiceContextProvider };