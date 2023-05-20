import React, {useState, createContext, useRef, useContext, useEffect} from "react";
import { DataContext } from "./data_provider";

const StaffFilterContext = createContext();

const StaffFilterProvider = ({children}) => {
  const {staff} = useContext(DataContext);
  const [filters, setFilters] = useState(new Map());
  const [filteredStaff, setFilteredStaff] = useState(staff);

  const addFilter = (key, filter) => {
    filters.set(key, filter);
    applyFilters();
  };

  const removeFilter = (key) => {
    filters.delete(key);
    applyFilters();
  };

  const applyFilters = () => {
    let updatedStaff = [...staff];
    for (let [key, fn] of filters) {
      updatedStaff = updatedStaff.filter(fn);
    }
    setFilteredStaff(updatedStaff);
  };

  return (
    <StaffFilterContext.Provider value={{
      filteredStaff,
      filters,
      addFilter,
      removeFilter
    }}>
      {children}
    </StaffFilterContext.Provider>
  );
};


const DeliveryFilterContext = createContext();

const DeliveryFilterProvider = ({children}) => {
  const context = useContext(DataContext);
  const [filters, setFilters] = useState(new Map());
  const [deliveries, setDeliveries] = useState(context.deliveries);

  const addFilter = (key, filter) => {
    filters.set(key, filter);
    applyFilters();
  };

  const removeFilter = (key) => {
    filters.delete(key);
    applyFilters();
  };

  const applyFilters = () => {
    let updatedDeliveries = context.deliveries;
    for (let [key, fn] of filters) {
      updatedDeliveries = updatedDeliveries.filter(fn);
    }
    setDeliveries(updatedDeliveries);
  };

  return (
    <DeliveryFilterContext.Provider value={{
      deliveries,
      filters,
      addFilter,
      removeFilter
    }}>
      {children}
    </DeliveryFilterContext.Provider>
  );
}

export {
  StaffFilterContext,
  StaffFilterProvider,
  DeliveryFilterContext,
  DeliveryFilterProvider
};