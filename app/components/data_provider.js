import React, {useState, createContext, useEffect, useRef} from "react";
import io from 'socket.io-client';
import { server } from "../environment.js";
import { storeData, getData } from "../utils/storage.js";

const DataContext = createContext();

const DataProvider = ({children}) => {
  const [socket, setSocket] = useState(io(server.uri));
  const [user, setUser] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [staff, setStaff] = useState([]);
  const [trips, setTrips] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  // staff filters
  const [staffFilters, setStaffFilters] = useState(new Map());
  const [filteredStaff, setFilteredStaff] = useState(staff);

  const addStaffFilter = (key, filter) => {
    staffFilters.set(key, filter);
    applyStaffFilters();
  };

  const removeStaffFilter = (key) => {
    staffFilters.delete(key);
    applyStaffFilters();
  };

  const applyStaffFilters = () => {
    let updatedStaff = [...staff];
    for (let [key, fn] of staffFilters) {
      updatedStaff = updatedStaff.filter(fn);
    }
    setFilteredStaff(updatedStaff);
  };

  // delivery filters
  const [deliveryFilters, setDeliveryFilters] = useState(new Map());
  const [filteredDeliveries, setFilteredDeliveries] = useState(deliveries);

  const addDeliveryFilter = (key, filter) => {
    deliveryFilters.set(key, filter);
    applyDeliveryFilters();
  };

  const removeDeliveryFilter = (key) => {
    deliveryFilters.delete(key);
    applyDeliveryFilters();
  };

  const applyDeliveryFilters = () => {
    let updatedDeliveries = [...deliveries];
    for (let [key, fn] of deliveryFilters) {
      updatedDeliveries = updatedDeliveries.filter(fn);
    }
    setFilteredDeliveries(updatedDeliveries);
  };

  const includes = (item, list) => {
    for (const i of list) {
      if (i._id === item._id) {
        return true;
      }
    }
    return false;
  };

  const checkFilters = (filters, item) => {
    for (let [key, fn] of filters) {
      if (!fn(item)) {
        return false;
      }
    }
    return true;
  };

  // socket listeners
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    socket.on('auth', ({user}) => {
      setUser(user);
      storeData('user', user);
    });

    socket.on('init:delivery', (deliveries) => {
      setDeliveries(deliveries);
      setFilteredDeliveries(deliveries);
    });

    socket.on('post:delivery', (delivery) => {
      postDelivery(delivery);
    });

    socket.on('update:delivery', (delivery) => {
      console.log('update:delivery', delivery);
      updateDelivery(delivery);
    });

    socket.on('init:staff', (worker) => {
      initStaff(worker);
    });

    socket.on('post:staff', (worker) => {
      postStaff(worker);
    });

    socket.on('update:staff', (worker) => {
      updateStaff(worker);
    });

    socket.on('delete:staff', (worker) => {
      deleteStaff(worker);
    });

    socket.on('init:trip', (trips) => {
      setTrips(trips);
    });

    socket.on('post:trip', (trip) => {
      postTrip(trip);
    });

    socket.on('update:trip', (trip) => {
      updateTrip(trip);
    });

    socket.on('init:restaurant', (restaurants) => {
      initRestaurant(restaurants);
    });

    socket.on('post:restaurant', (restaurant) => {
      postRestaurant(restaurant);
    });

    socket.on('update:restaurant', (restaurant) => {
      updateRestaurant(restaurant);
    });

    socket.on('post:brand', (brand) => {
      postBrand(brand);
    });

    return () => {
      socket.off('connect');
      socket.off('init:delivery');
      socket.off('post:delivery');
      socket.off('update:delivery');
      socket.off('init:staff');
      socket.off('post:staff');
      socket.off('update:staff');
      socket.off('delete:staff');
      socket.off('init:trip');
      socket.off('post:trip');
      socket.off('update:trip');
      socket.off('init:restaurant');
      socket.off('post:restaurant');
      socket.off('update:restaurant');
      socket.off('post:brand');
    };
  }, [
    socket,
    user,
    deliveries,
    staff,
    trips,
    restaurants,
    filteredDeliveries,
    filteredStaff
  ]);

  // try to get user from storage
  useEffect(() => {
    const userPromise = getData('user');
    const restaurantPromise = getData('restaurant');
    const brandPromise = getData('brand');
    console.log('getting user from storage');
    Promise.all([userPromise, restaurantPromise, brandPromise])
      .then(([user, restaurant, brand]) => {
        setUser(user)
        if (user && (restaurant || brand)) {
          console.log('getting user from storage', {user, restaurant, brand});
          socket.emit('post:staff', {user, restaurant, brand});
        }
      }
    );
  }, []);

  const postDelivery = (delivery) => {
    if (checkFilters(deliveryFilters, delivery) && !includes(delivery, filteredDeliveries)) {
      setFilteredDeliveries([...filteredDeliveries, delivery]);
    }
    setDeliveries([...deliveries, delivery]);
  };

  const updateDelivery = (delivery) => {
    setFilteredDeliveries(filteredDeliveries.map((d) => {
      if (d._id === delivery._id) {
        return delivery;
      }
      return d;
    }));
    setDeliveries(deliveries.map((d) => {
      if (d._id === delivery._id) {
        return delivery;
      }
      return d;
    }));
  };

  const initStaff = (s) => {
    setStaff(s);
    setFilteredStaff(s);
  };

  const postStaff = (s) => {
    if (s._id === user) {
      setUser(s);
    }
    setStaff([...staff, s]);
    if (checkFilters(staffFilters, s)) {
      setFilteredStaff([...filteredStaff, s]);
    }
  };

  const updateStaff = (updatedStaff) => {
    const newStaff = staff.map((s) => {
      if (s._id === updatedStaff._id) {
        return updatedStaff;
      }
      return s;
    });
    setStaff(newStaff);
    setFilteredStaff(newStaff);
  };

  const deleteStaff = (worker) => {
    const newStaff = staff.filter((item) => item._id !== worker);
    setStaff(newStaff);
    if (user._id === worker) setUser(null);
  };

  const postTrip = (trip) => {
    setTrips([...trips, trip]);
  };

  const updateTrip = (trip) => {
    const newTrips = trips.map((t) => {
      if (t._id === trip._id) {
        return trip;
      }
      return t;
    });
    setTrips(newTrips);
  };

  const initRestaurant = (restaurants) => {
    setRestaurants(restaurants);
    if (user.restaurant) {
      for (const r of restaurants) {
        if (r.name === user.restaurant) {
          user.restaurantId = r._id;
          break;
        }
      }
    }
  };

  const postRestaurant = (restaurant) => {
    setRestaurants([...restaurants, restaurant]);
  };

  const updateRestaurant = (restaurant) => {
    const newRestaurants = restaurants.map((r) => {
      if (r._id === restaurant._id) {
        return restaurant;
      }
      return r;
    });
    setRestaurants(newRestaurants);
  };

  const postBrand = ({_id}) => {
    storeData('brand', _id);
  };

  return (
    <DataContext.Provider value={{
      socket,
      user,
      deliveries,
      staff,
      trips,
      restaurants,
      filteredStaff,
      staffFilters,
      addStaffFilter,
      removeStaffFilter,
      filteredDeliveries,
      deliveryFilters,
      addDeliveryFilter,
      removeDeliveryFilter
    }}>
      {children}
    </DataContext.Provider>
  );
};

export {DataContext, DataProvider};