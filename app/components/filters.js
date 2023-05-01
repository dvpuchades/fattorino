import React, {useState, useEffect, useContext} from "react";
import {
  NativeBaseProvider,
  extendTheme,
  Text,
  Button,
  Square,
  View,
  VStack,
  Center,
  Spacer,
  Input,
  FlatList,
  HStack,
  Box,
  Fab,
  Icon,
  FormControl,
  Actionsheet,
  useDisclose
} from "native-base";
import { colors } from '../constants.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DataService from "../services/data_service.js";
import { DeliveryContext, StaffContext } from "../components/context_providers.js";

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
  const { refreshStaff, setFilters } = useContext(StaffContext);
  const restaurants = DataService.restaurants.map((r) => r.name);
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {
          restaurants.map((restaurant) => {
            return (
              <FilterCheckbox key={restaurant} onCheck={() => {
                DataService.removeStaffFilter("restaurant.remove" + restaurant);
                refreshStaff();
                setFilters(DataService.getStaffFilters());
              }}
              onUncheck={() => {
                DataService.addStaffFilter("restaurant.remove" + restaurant, (s) => s.restaurant !== restaurant);
                refreshStaff();
                setFilters(DataService.getStaffFilters());
              }} default={!DataService.staffFilters.has("restaurant.remove" + restaurant)}
              >{restaurant}</FilterCheckbox>
            );
          })
        }
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const DeliveryStatusFilter = ({ isOpen, onClose }) => {
  const { refreshDeliveries, setFilters } = useContext(DeliveryContext);
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <FilterCheckbox onCheck={() => {
          DataService.removeDeliveryFilter("status.removePreparing");
          refreshDeliveries();
          setFilters(DataService.getDeliveryFilters());
        }}
        onUncheck={() => {
          DataService.addDeliveryFilter("status.removePreparing", (d) => d.status !== "preparing");
          refreshDeliveries();
          setFilters(DataService.getDeliveryFilters());
        }} default={!DataService.deliveryFilters.has("status.removePreparing")}
        >preparing</FilterCheckbox>
        <FilterCheckbox onCheck={() => {
          DataService.removeDeliveryFilter("status.removeReady");
          refreshDeliveries();
          setFilters(DataService.getDeliveryFilters());
        }}
        onUncheck={() => {
          DataService.addDeliveryFilter("status.removeReady", (d) => d.status !== "ready");
          refreshDeliveries();
          setFilters(DataService.getDeliveryFilters());
        }} default={!DataService.deliveryFilters.has("status.removeReady")}
        >ready</FilterCheckbox>
        <FilterCheckbox onCheck={() => {
          DataService.removeDeliveryFilter("status.removeDelivering");
          refreshDeliveries();
          setFilters(DataService.getDeliveryFilters());
        }}
        onUncheck={() => {
          DataService.addDeliveryFilter("status.removeDelivering", (d) => d.status !== "delivering");
          refreshDeliveries();
          setFilters(DataService.getDeliveryFilters());
        }} default={!DataService.deliveryFilters.has("status.removeDelivering")}
        >delivering</FilterCheckbox>
        <FilterCheckbox onCheck={() => {
          DataService.removeDeliveryFilter("status.removeShipped");
          refreshDeliveries();
          setFilters(DataService.getDeliveryFilters());
        }}
        onUncheck={() => {
          DataService.addDeliveryFilter("status.removeShipped", (d) => d.status !== "shipped");
          refreshDeliveries();
          setFilters(DataService.getDeliveryFilters());
        }} default={!DataService.deliveryFilters.has("status.removeShipped")}
        >shipped</FilterCheckbox>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const DeliveryCityFilter = ({ isOpen, onClose }) => {
  const { refreshDeliveries, setFilters } = useContext(DeliveryContext);
  const cities = Array.from(DataService.getDeliveryCities());
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {
          cities.map((city) => {
            return (
              <FilterCheckbox key={city} onCheck={() => {
                DataService.removeDeliveryFilter("city.remove" + city);
                refreshDeliveries();
                setFilters(DataService.getDeliveryFilters());
              }}
              onUncheck={() => {
                DataService.addDeliveryFilter("city.remove" + city, (d) => d.city !== city);
                refreshDeliveries();
                setFilters(DataService.getDeliveryFilters());
              }} default={!DataService.deliveryFilters.has("city.remove" + city)}
              >{city}</FilterCheckbox>
            );
          })
        }
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const DeliveryPostcodeFilter = ({ isOpen, onClose }) => {
  const { refreshDeliveries, setFilters } = useContext(DeliveryContext);
  const postcodes = Array.from(DataService.getDeliveryPostcodes());
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {
          postcodes.map((postcode) => {
            return (
              <FilterCheckbox key={postcode} onCheck={() => {
                DataService.removeDeliveryFilter("postcode.remove" + postcode);
                refreshDeliveries();
                setFilters(DataService.getDeliveryFilters());
              }}
              onUncheck={() => {
                DataService.addDeliveryFilter("postcode.remove" + postcode, (d) => d.postcode !== postcode);
                refreshDeliveries();
                setFilters(DataService.getDeliveryFilters());
              }} default={!DataService.deliveryFilters.has("postcode.remove" + postcode)}
              >{postcode}</FilterCheckbox>
            );
          })
        }
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const DeliveryCourierFilter = ({ isOpen, onClose }) => {
  const { refreshDeliveries, setFilters } = useContext(DeliveryContext);
  const couriers = Array.from(DataService.getDeliveryCouriers());
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {
          couriers.map((courier) => {
            return (
              <FilterCheckbox key={courier} onCheck={() => {
                DataService.removeDeliveryFilter("courier.remove" + courier);
                refreshDeliveries();
                setFilters(DataService.getDeliveryFilters());
              }}
              onUncheck={() => {
                DataService.addDeliveryFilter("courier.remove" + courier, (d) => d.courier !== courier);
                refreshDeliveries();
                setFilters(DataService.getDeliveryFilters());
              }} default={!DataService.deliveryFilters.has("courier.remove" + courier)}
              >{courier}</FilterCheckbox>
            );
          })
        }
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const DeliveryRestaurantFilter = ({ isOpen, onClose }) => {
  const { refreshDeliveries, setFilters } = useContext(DeliveryContext);
  const restaurants = DataService.restaurants.map((r) => r.name);
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {
          restaurants.map((restaurant) => {
            return (
              <FilterCheckbox key={restaurant} onCheck={() => {
                DataService.removeDeliveryFilter("restaurant.remove" + restaurant);
                refreshDeliveries();
                setFilters(DataService.getDeliveryFilters());
              }}
              onUncheck={() => {
                DataService.addDeliveryFilter("restaurant.remove" + restaurant, (d) => d.restaurant !== restaurant);
                refreshDeliveries();
                setFilters(DataService.getDeliveryFilters());
              }} default={!DataService.deliveryFilters.has("restaurant.remove" + restaurant)}
              >{restaurant}</FilterCheckbox>
            );
          })
        }
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export {
  StaffRestaurantFilter,
  DeliveryStatusFilter,
  DeliveryCityFilter,
  DeliveryPostcodeFilter,
  DeliveryCourierFilter,
  DeliveryRestaurantFilter
};