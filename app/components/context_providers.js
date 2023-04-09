import React, {useState, createContext} from "react";

import dataService from "../services/data_service";

const UserContext = createContext();

const UserProvider = ({children}) => {
  const [user, setUser] = useState(dataService.user);

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};

const StaffContext = createContext();

const StaffProvider = ({children}) => {
  const [staff, setStaff] = useState(dataService.getStaff());
  const [filters, setFilters] = useState(dataService.getStaffFilters());

  const refreshStaff = () => {
    setStaff(dataService.getStaff());
  };

  return (
    <StaffContext.Provider value={{
      staff,
      setStaff,
      filters,
      setFilters,
      refreshStaff
    }}>
      {children}
    </StaffContext.Provider>
  );
};

const DeliveryContext = createContext();

const DeliveryProvider = ({children}) => {
  const [deliveries, setDeliveries] = useState(dataService.getDeliveries());
  const [filters, setFilters] = useState(dataService.getDeliveryFilters());
  const [trips, setTrips] = useState(dataService.getTrips());

  const addDelivery = (delivery) => {
    setDeliveries([...deliveries, delivery]);
  };

  const updateDelivery = (delivery) => {
    const newDeliveries = deliveries.map((d) => {
      if (d.id === delivery.id) {
        return delivery;
      }
      return d;
    });
    setDeliveries(newDeliveries);
  };

  const refreshDeliveries = () => {
    setDeliveries(dataService.getDeliveries());
  };

  return (
    <DeliveryContext.Provider 
    value={{
      deliveries,
      setDeliveries,
      addDelivery,
      updateDelivery,
      refreshDeliveries,
      trips,
      filters,
      setFilters
    }}>
      {children}
    </DeliveryContext.Provider>
  );
};

const RestaurantContext = createContext();

const RestaurantProvider = ({children}) => {
  const [restaurants, setRestaurants] = useState(dataService.getRestaurants());

  const addRestaurant = (restaurant) => {
    setRestaurants([...restaurants, restaurant]);
  };

  return (
    <RestaurantContext.Provider value={{restaurants, setRestaurants, addRestaurant}}>
      {children}
    </RestaurantContext.Provider>
  );
};


export {
  UserContext,
  UserProvider,
  DeliveryContext,
  DeliveryProvider,
  StaffContext,
  StaffProvider,
  RestaurantContext,
  RestaurantProvider
};