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
import dataService from "../services/data_service.js";
import { DeliveryContext, DeliveryProvider, StaffContext } from "../components/context_providers.js";

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
  const restaurants = dataService.restaurants.map((r) => r.name);
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {
          restaurants.map((restaurant) => {
            return (
              <FilterCheckbox key={restaurant} onCheck={() => {
                dataService.removeStaffFilter("restaurant.remove" + restaurant);
                refreshStaff();
                setFilters(dataService.getStaffFilters());
              }}
              onUncheck={() => {
                dataService.addStaffFilter("restaurant.remove" + restaurant, (s) => s.restaurant !== restaurant);
                refreshStaff();
                setFilters(dataService.getStaffFilters());
              }} default={!dataService.staffFilters.has("restaurant.remove" + restaurant)}
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
          dataService.removeDeliveryFilter("status.removePreparing");
          refreshDeliveries();
          setFilters(dataService.getDeliveryFilters());
        }}
        onUncheck={() => {
          dataService.addDeliveryFilter("status.removePreparing", (d) => d.status !== "preparing");
          refreshDeliveries();
          setFilters(dataService.getDeliveryFilters());
        }} default={!dataService.deliveryFilters.has("status.removePreparing")}
        >preparing</FilterCheckbox>
        <FilterCheckbox onCheck={() => {
          dataService.removeDeliveryFilter("status.removeReady");
          refreshDeliveries();
          setFilters(dataService.getDeliveryFilters());
        }}
        onUncheck={() => {
          dataService.addDeliveryFilter("status.removeReady", (d) => d.status !== "ready");
          refreshDeliveries();
          setFilters(dataService.getDeliveryFilters());
        }} default={!dataService.deliveryFilters.has("status.removeReady")}
        >ready</FilterCheckbox>
        <FilterCheckbox onCheck={() => {
          dataService.removeDeliveryFilter("status.removeDelivering");
          refreshDeliveries();
          setFilters(dataService.getDeliveryFilters());
        }}
        onUncheck={() => {
          dataService.addDeliveryFilter("status.removeDelivering", (d) => d.status !== "delivering");
          refreshDeliveries();
          setFilters(dataService.getDeliveryFilters());
        }} default={!dataService.deliveryFilters.has("status.removeDelivering")}
        >delivering</FilterCheckbox>
        <FilterCheckbox onCheck={() => {
          dataService.removeDeliveryFilter("status.removeShipped");
          refreshDeliveries();
          setFilters(dataService.getDeliveryFilters());
        }}
        onUncheck={() => {
          dataService.addDeliveryFilter("status.removeShipped", (d) => d.status !== "shipped");
          refreshDeliveries();
          setFilters(dataService.getDeliveryFilters());
        }} default={!dataService.deliveryFilters.has("status.removeShipped")}
        >shipped</FilterCheckbox>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const DeliveryCityFilter = ({ isOpen, onClose }) => {
  const { refreshDeliveries, setFilters } = useContext(DeliveryContext);
  const cities = Array.from(dataService.getDeliveryCities());
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {
          cities.map((city) => {
            return (
              <FilterCheckbox key={city} onCheck={() => {
                dataService.removeDeliveryFilter("city.remove" + city);
                refreshDeliveries();
                setFilters(dataService.getDeliveryFilters());
              }}
              onUncheck={() => {
                dataService.addDeliveryFilter("city.remove" + city, (d) => d.city !== city);
                refreshDeliveries();
                setFilters(dataService.getDeliveryFilters());
              }} default={!dataService.deliveryFilters.has("city.remove" + city)}
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
  const postcodes = Array.from(dataService.getDeliveryPostcodes());
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {
          postcodes.map((postcode) => {
            return (
              <FilterCheckbox key={postcode} onCheck={() => {
                dataService.removeDeliveryFilter("postcode.remove" + postcode);
                refreshDeliveries();
                setFilters(dataService.getDeliveryFilters());
              }}
              onUncheck={() => {
                dataService.addDeliveryFilter("postcode.remove" + postcode, (d) => d.postcode !== postcode);
                refreshDeliveries();
                setFilters(dataService.getDeliveryFilters());
              }} default={!dataService.deliveryFilters.has("postcode.remove" + postcode)}
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
  const couriers = Array.from(dataService.getDeliveryCouriers());
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {
          couriers.map((courier) => {
            return (
              <FilterCheckbox key={courier} onCheck={() => {
                dataService.removeDeliveryFilter("courier.remove" + courier);
                refreshDeliveries();
                setFilters(dataService.getDeliveryFilters());
              }}
              onUncheck={() => {
                dataService.addDeliveryFilter("courier.remove" + courier, (d) => d.courier !== courier);
                refreshDeliveries();
                setFilters(dataService.getDeliveryFilters());
              }} default={!dataService.deliveryFilters.has("courier.remove" + courier)}
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
  const restaurants = dataService.restaurants.map((r) => r.name);
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {
          restaurants.map((restaurant) => {
            return (
              <FilterCheckbox key={restaurant} onCheck={() => {
                dataService.removeDeliveryFilter("restaurant.remove" + restaurant);
                refreshDeliveries();
                setFilters(dataService.getDeliveryFilters());
              }}
              onUncheck={() => {
                dataService.addDeliveryFilter("restaurant.remove" + restaurant, (d) => d.restaurant !== restaurant);
                refreshDeliveries();
                setFilters(dataService.getDeliveryFilters());
              }} default={!dataService.deliveryFilters.has("restaurant.remove" + restaurant)}
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