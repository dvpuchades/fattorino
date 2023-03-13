import {
  Text,
  Button,
  VStack,
  Center,
  HStack,
  Box
} from "native-base";
import { colors } from '../constants.js';
import { FilteredListLayout, ProfileLayout } from "../components/layouts.js";
import { useDisclose, Actionsheet } from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ListItem, Tag, TripCard, Option } from "../components/widgets.js";
import { useContext, useState } from "react";
import { StaffContext } from "../components/context_providers.js";
import { StaffRestaurantFilter } from "../components/filters.js";
import dataService from "../services/data_service.js";

const StaffList = ({navigation}) => {
  const restaurantDisclose = useDisclose();
  const { staff, refreshStaff, setFilters } = useContext(StaffContext);
  const filters = dataService.getStaffFilters();
  return (
    <Box flex={1}>
    <FilteredListLayout title="Staff"
    data={staff}
    renderItem={StaffListItem}
    navigation={navigation}
    >
      <Button mx="2" rounded="full" margin="auto" textAlign="center"
      onPress={ () => restaurantDisclose.onOpen()}
      variant={filters.has("restaurant") ? "outline" : "solid"}>
      by restaurant
      </Button>
      <FilterToggle onCheck={ () => {
        dataService.addStaffFilter("statusIdle.remove", (staff) => staff.status == "idle");
        refreshStaff();
        setFilters(dataService.getStaffFilters());
      }}
      onUncheck={ () => {
        dataService.removeStaffFilter("statusIdle.remove");
        refreshStaff();
        setFilters(dataService.getStaffFilters());
      }}
      default={filters.has("statusIdle")}
      >
      in place
      </FilterToggle>
      <FilterToggle onCheck={ () => {
        dataService.addStaffFilter("statusDelivering.remove", (staff) => staff.status == "delivering");
        refreshStaff();
        setFilters(dataService.getStaffFilters());
      }}
      onUncheck={ () => {
        dataService.removeStaffFilter("statusDelivering.remove");
        refreshStaff();
        setFilters(dataService.getStaffFilters());
      }}
      default={filters.has("statusDelivering")}
      >
      delivering
      </FilterToggle>
      <FilterToggle onCheck={ () => {
        dataService.addStaffFilter("money.holders", (staff) => staff.balance > 0);
        refreshStaff();
        setFilters(dataService.getStaffFilters());
      }}
      onUncheck={ () => {
        dataService.removeStaffFilter("money.holders");
        refreshStaff();
        setFilters(dataService.getStaffFilters());
      }}
      default={filters.has("money")}
      >
      lacking money
      </FilterToggle>
    </FilteredListLayout>
    <StaffRestaurantFilter isOpen={restaurantDisclose.isOpen} onClose={restaurantDisclose.onClose}/>
    </Box>
  );
};

const FilterToggle = (props) => {
  const [checked, setChecked] = useState(props.default || false);
  return (
    <Button mx="2" rounded="full" margin="auto" textAlign="center"
      onPress={ () => {
        if (checked) {
          props.onUncheck();
        } else {
          props.onCheck();
        }
        setChecked(!checked);
      } }
      variant={checked ? "outline" : "solid"}>
      { props.children }
      </Button>
  );
};

const StaffListItem = (props) => {
  return (
    <ListItem principalText={props.data.name}
    secondaryText={props.data.restaurant}
    iconName={props.data.status == "delivering" ? "bike" : "account-clock-outline"}
    iconColor={colors.primaryColor}
    onPress={() => props.navigation.navigate("StaffProfile", {staff: props.data})}
    />
  );
};

const StaffProfile = ({route}) => {
  const staff = route.params.staff;
  return (
    <ProfileLayout title={staff.name}
    subtitle={staff.restaurant}>
      {
        staff.currentTrip ?
        ( <TripCard title={"Current trip, started at " + staff.currentTrip.initTime}
        trip={staff.currentTrip}/> ) : null
      }
      <Box margin="4">
        <Tag icon="comment-account" text={staff.status}
        color={colors.primaryColor}/>
        <Tag icon="truck-delivery" 
        text={staff.numberOfDeliveries + " deliveries delivered today"}/>
        <Tag icon="cash" text={staff.balance + " € in balance"}/>
        <Tag icon="phone" text={staff.phone}/>
        <Option text="log him out" icon="logout"/>
      </Box>
      <Button mx="4" colorScheme="primary"
      onPress={() => { }}
      >Call now</Button>
    </ProfileLayout>
  );
};

export { StaffList, StaffProfile };
