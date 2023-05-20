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
import { useDisclose } from "native-base";
import { ListItem, Tag, TripCard, Option } from "../components/widgets.js";
import { useContext, useState } from "react";
import { hasFilter, StaffRestaurantFilter } from "../components/filters.js";
import { StaffFilterContext } from "../components/filter_providers.js";
import { DataContext } from "../components/data_provider.js";

const StaffList = ({navigation}) => {
  const restaurantDisclose = useDisclose();
  const { filteredStaff, staffFilters, addStaffFilter, removeStaffFilter } = useContext(DataContext);

  return (
    <Box flex={1}>
    <FilteredListLayout title="Staff"
    data={filteredStaff}
    renderItem={StaffListItem}
    navigation={navigation}
    >
      <Button mx="2" rounded="full" margin="auto" textAlign="center"
      onPress={ () => restaurantDisclose.onOpen()}
      variant={hasFilter("restaurant", staffFilters) ? "outline" : "solid"}>
      by restaurant
      </Button>
      <FilterToggle onCheck={ () => {
        addStaffFilter("statusIdle.remove", (staff) => staff.status !== "idle");
      }}
      onUncheck={ () => {
        removeStaffFilter("statusIdle.remove");
      }}
      default={hasFilter("statusIdle", staffFilters)}
      >
      in place
      </FilterToggle>
      <FilterToggle onCheck={ () => {
        addStaffFilter("statusDelivering.remove", (staff) => staff.status !== "delivering");
      }}
      onUncheck={ () => {
        removeStaffFilter("statusDelivering.remove");
      }}
      default={hasFilter("statusDelivering", staffFilters)}
      >
      delivering
      </FilterToggle>
      <FilterToggle onCheck={ () => {
        addStaffFilter("money.holders", (staff) => staff.balance > 0);
      }}
      onUncheck={ () => {
        removeStaffFilter("money.holders");
      }}
      default={hasFilter("money", staffFilters)}
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
