import React, {useState, createContext, useContext} from "react";
import {SocketContext} from "../services/socket_provider.js";
import DataService from "../services/data_service";

const UserContext = createContext();

const UserProvider = ({children}) => {
  const [user, setUser] = useState(DataService.user);
  const [needsRestaurant, setNeedsRestaurant] = useState(true);
  return (
    <UserContext.Provider value={{
      user,
      setUser,
      needsRestaurant,
      setNeedsRestaurant
    }}>
      {children}
    </UserContext.Provider>
  );
};

const StaffContext = createContext();

const StaffProvider = ({children}) => {
  const [staff, setStaff] = useState(DataService.getStaff());
  const [filters, setFilters] = useState(DataService.getStaffFilters());
  const { useSocketEvent } = useContext(SocketContext);

  useSocketEvent('updateStaff', ({staff}) => {
    DataService.setStaff(staff);
    refreshStaff();
  });

  const refreshStaff = () => {
    setStaff(DataService.getStaff());
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
  const [deliveries, setDeliveries] = useState([]);
  const [filters, setFilters] = useState(DataService.getDeliveryFilters());

  const [trips, setTrips] = useState(DataService.getTrips());

  const { useSocketEvent } = useContext(SocketContext);

  useSocketEvent('newDelivery', (data) => {
    console.log('New delivery is being called now');
    console.log(data);
    if (data.created) {
      addDelivery(data.delivery);
    } else {
      console.log('Error creating delivery:', data.error);
    }
  });

  useSocketEvent('updateDelivery', (data) => {
    if (data.updated) {
      DataService.updateDelivery(data.delivery);
      updateDelivery(data.delivery);
    } else {
      console.log('Error updating delivery:', data.error);
    }
  });

  const addDelivery = (delivery) => {
    DataService.addDelivery(delivery);
    if (DataService.filterDelivery(delivery)) {
      setDeliveries([...deliveries, delivery]);
    }
  };

  const updateDelivery = (delivery) => {
    const newDeliveries = deliveries.map((d) => {
      if (d._id === delivery._id) {
        return delivery;
      }
      return d;
    });
    setDeliveries(newDeliveries);
  };

  const refreshDeliveries = () => {
    setDeliveries(DataService.getDeliveries());
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
  const [restaurants, setRestaurants] = useState(DataService.getRestaurants());

  const { useSocketEvent } = useContext(SocketContext);

  useSocketEvent('createRestaurant', (data) => {
    if (data.created) {
      addRestaurant(data.restaurant);
    } else {
      console.log('Error creating restaurant:', data.error);
    }
  });
  
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