import React, {useState, useEffect, useContext, useRef} from "react";
import {
  Icon,
  Actionsheet
} from "native-base";
import { colors } from '../constants.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataContext } from "./data_provider.js";

const hasFilter = (key, filters) => {
  const filterKeys = filters.keys();
  for (const filterKey of filterKeys) {
    const main = filterKey.split('.')[0];
    if (main === key) return true;
  }
  return false;
};

const FilterCheckbox = (props) => {
  const [checked, setChecked] = useState(props.default || false);
  const handlePress = () => {
    if (checked) {
      props.onUncheck();
    } else {
      props.onCheck();
    }
    setChecked(!checked);
  };
  return (
    <Actionsheet.Item
    onPress={handlePress}
    endIcon={checked ? 
      <Icon as={<MaterialCommunityIcons name="check" />}
      color={colors.primaryColor} size="md"/>
      : null
    }
    >{props.children}</Actionsheet.Item>
  );
};

const StaffRestaurantFilter = ({ isOpen, onClose }) => {
  const { staffFilters, addStaffFilter, removeStaffFilter } = useContext(DataContext);
  const { restaurants } = useContext(DataContext);
  const restaurantNames = useRef([]);

  useEffect(() => {
    restaurantNames.current = restaurants.map((r) => r.name);
  }, [restaurantNames, restaurants]);

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {
          restaurantNames.current.map((restaurant) => {
            return (
              <FilterCheckbox key={restaurant} onCheck={() => {
                removeStaffFilter("restaurant.remove" + restaurant);
              }}
              onUncheck={() => {
                addStaffFilter("restaurant.remove" + restaurant, (s) => s.restaurant !== restaurant);
              }} default={!staffFilters.has("restaurant.remove" + restaurant)}
              >{restaurant}</FilterCheckbox>
            );
          })
        }
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const DeliveryStatusFilter = ({ isOpen, onClose }) => {
  const { deliveryFilters, addDeliveryFilter, removeDeliveryFilter } = useContext(DataContext);
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <FilterCheckbox onCheck={() => {
          removeDeliveryFilter("status.removePreparing");
        }}
        onUncheck={() => {
          addDeliveryFilter("status.removePreparing", (d) => d.status !== "preparing");
        }} default={!deliveryFilters.has("status.removePreparing")}
        >preparing</FilterCheckbox>
        <FilterCheckbox onCheck={() => {
          removeDeliveryFilter("status.removeReady");
        }}
        onUncheck={() => {
          addDeliveryFilter("status.removeReady", (d) => d.status !== "ready");
        }} default={!deliveryFilters.has("status.removeReady")}
        >ready</FilterCheckbox>
        <FilterCheckbox onCheck={() => {
          removeDeliveryFilter("status.removeDelivering");
        }}
        onUncheck={() => {
          addDeliveryFilter("status.removeDelivering", (d) => d.status !== "delivering");
        }} default={!deliveryFilters.has("status.removeDelivering")}
        >delivering</FilterCheckbox>
        <FilterCheckbox onCheck={() => {
          removeDeliveryFilter("status.removeShipped");
        }}
        onUncheck={() => {
          addDeliveryFilter("status.removeShipped", (d) => d.status !== "shipped");
        }} default={!deliveryFilters.has("status.removeShipped")}
        >shipped</FilterCheckbox>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const DeliveryCityFilter = ({ isOpen, onClose }) => {
  const { deliveryFilters, addDeliveryFilter, removeDeliveryFilter } = useContext(DataContext);
  const { deliveries } = useContext(DataContext);
  const cities = useRef([]);

  useEffect(() => {
    cities.current = [...new Set(deliveries.map((item) => item.city))];
  }, [cities, deliveries]);

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {
          cities.current.map((city) => {
            return (
              <FilterCheckbox key={city} onCheck={() => {
                removeDeliveryFilter("city.remove" + city);
              }}
              onUncheck={() => {
                addDeliveryFilter("city.remove" + city, (d) => d.city !== city);
              }} default={!deliveryFilters.has("city.remove" + city)}
              >{city}</FilterCheckbox>
            );
          })
        }
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const DeliveryPostcodeFilter = ({ isOpen, onClose }) => {
  const { deliveryFilters, addDeliveryFilter, removeDeliveryFilter } = useContext(DataContext);
  const { deliveries } = useContext(DataContext);
  const postcodes = useRef([]);

  useEffect(() => {
    postcodes.current = [...new Set(deliveries.map((item) => item.postcode))];
  }, [postcodes, deliveries]);

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {
          postcodes.current.map((postcode) => {
            return (
              <FilterCheckbox key={postcode} onCheck={() => {
                removeDeliveryFilter("postcode.remove" + postcode);
              }}
              onUncheck={() => {
                addDeliveryFilter("postcode.remove" + postcode, (d) => d.postcode !== postcode);
              }} default={!deliveryFilters.has("postcode.remove" + postcode)}
              >{postcode}</FilterCheckbox>
            );
          })
        }
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const DeliveryCourierFilter = ({ isOpen, onClose }) => {
  const { deliveryFilters, addDeliveryFilter, removeDeliveryFilter } = useContext(DataContext);
  const { deliveries } = useContext(DataContext);
  const couriers = useRef([]);

  useEffect(() => {
    const set = new Set(deliveries.map((item) => item.courier));
    set.delete(undefined);
    couriers.current = [...set];
  }, [couriers, deliveries]);

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {
          couriers.current.map((courier) => {
            return (
              <FilterCheckbox key={courier} onCheck={() => {
                removeDeliveryFilter("courier.remove" + courier);
              }}
              onUncheck={() => {
                addDeliveryFilter("courier.remove" + courier, (d) => d.courier !== courier);
              }} default={!deliveryFilters.has("courier.remove" + courier)}
              >{courier}</FilterCheckbox>
            );
          })
        }
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const DeliveryRestaurantFilter = ({ isOpen, onClose }) => {
  const { deliveryFilters, addDeliveryFilter, removeDeliveryFilter } = useContext(DataContext);
  const { restaurants } = useContext(DataContext);
  const restaurantNames = useRef([]);

  useEffect(() => {
    restaurantNames.current = restaurants.map((r) => r.name);
  }, [restaurantNames, restaurants]);

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {
          restaurantNames.current.map((restaurant) => {
            return (
              <FilterCheckbox key={restaurant} onCheck={() => {
                removeDeliveryFilter("restaurant.remove" + restaurant);
              }}
              onUncheck={() => {
                addDeliveryFilter("restaurant.remove" + restaurant, (d) => d.restaurant !== restaurant);
              }} default={!deliveryFilters.has("restaurant.remove" + restaurant)}
              >{restaurant}</FilterCheckbox>
            );
          })
        }
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export {
  hasFilter,
  StaffRestaurantFilter,
  DeliveryStatusFilter,
  DeliveryCityFilter,
  DeliveryPostcodeFilter,
  DeliveryCourierFilter,
  DeliveryRestaurantFilter
};