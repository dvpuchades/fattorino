
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
  useDisclose,
  Select
} from "native-base";
import { colors } from '../constants.js';
import { FormLayout, FilteredListLayout, ProfileLayout } from "../components/layouts.js";
import { ListItem, TripCard, Tag } from "../components/widgets.js";
import { useIsFocused } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Pressable, ScrollView } from "react-native";
import { DeliveryContext, UserContext } from "../components/context_providers.js";
import dataService from "../services/data_service.js";
import { DeliveryCityFilter, DeliveryStatusFilter, DeliveryPostcodeFilter, DeliveryCourierFilter, DeliveryRestaurantFilter } from "../components/filters.js";
import { newDelivery } from "../services/socket_handler.js";

const DeliveryList = ({navigation}) => {
  const statusDisclose = useDisclose();
  const cityDisclose = useDisclose();
  const postcodeDisclose = useDisclose();
  const courierDisclose = useDisclose();
  const restaurantDisclose = useDisclose();

  const { deliveries, refreshDeliveries } = useContext(DeliveryContext);
  // useEffect(() => {
  //   dataService.subscribe('newDelivery', refreshDeliveries);
  // }, [deliveries]);

  const filters = dataService.getDeliveryFilters();
  return (
    <Box flex={1}>
      <FilteredListLayout title="Deliveries"
      data={deliveries}
      renderItem={DeliveryListItem}
      navigation={navigation}
      >
        <Button mx="2" rounded="full" margin="auto" textAlign="center"
        onPress={ () => statusDisclose.onOpen()}
        variant={filters.has("status") ? "outline" : "solid"}>
        status
        </Button>
        <Button mx="2" rounded="full" margin="auto" textAlign="center"
        onPress= { () => cityDisclose.onOpen() }
        variant={filters.has("city") ? "outline" : "solid"}>
        cities
        </Button>
        <Button mx="2" rounded="full" margin="auto" textAlign="center"
        onPress={ () => postcodeDisclose.onOpen() }
        variant={filters.has("postcode") ? "outline" : "solid"}>
        postcodes
        </Button>
        <Button mx="2" rounded="full" margin="auto" textAlign="center"
        onPress={ () => courierDisclose.onOpen() }
        variant={filters.has("courier") ? "outline" : "solid"}>
        couriers
        </Button>
        <Button mx="2" rounded="full" margin="auto" textAlign="center"
        onPress={ () => restaurantDisclose.onOpen() }
        variant={filters.has("restaurant") ? "outline" : "solid"}>
        restaurant
        </Button>
        <Fab position="absolute" bottom="85" right="5" size="lg"
        icon={<Icon as={<MaterialCommunityIcons name="plus" />} color="white" size="md"/>}
        renderInPortal={useIsFocused()}
        onPress={() => navigation.navigate("PostDeliveryScreen")}
        />
      </FilteredListLayout>
      <DeliveryStatusFilter isOpen={statusDisclose.isOpen} onClose={statusDisclose.onClose}/>
      <DeliveryCityFilter isOpen={cityDisclose.isOpen} onClose={cityDisclose.onClose}/>
      <DeliveryPostcodeFilter isOpen={postcodeDisclose.isOpen} onClose={postcodeDisclose.onClose}/>
      <DeliveryCourierFilter isOpen={courierDisclose.isOpen} onClose={courierDisclose.onClose}/>
      <DeliveryRestaurantFilter isOpen={restaurantDisclose.isOpen} onClose={restaurantDisclose.onClose}/>
    </Box>
  );
};

const DeliveryListItem = (props) => {
  return (
    <ListItem principalText={props.data.address}
    secondaryText={props.data.city + ", " + props.data.postcode}
    optionalText={props.data.initTime}
    iconByStatus={props.data.status}
    iconColor={colors.primaryColor}
    onPress={() => props.navigation.navigate("DeliveryProfile", {delivery: props.data})}
    />
  );
};

const DeliveryProfile = ({route}) => {
  const delivery = route.params.delivery;
  const subscribedToContext = useContext(DeliveryContext);
  return (
    <ProfileLayout title={delivery.address}
    subtitle={delivery.city + ", " + delivery.postcode}>
      { delivery.suggestedTrip ?
        <TripCard
        title={"Suggested trip, leave at " + delivery.suggestedTrip.initTime}
        trip={delivery.suggestedTrip}/> : null
      }
      <Box margin="4">
        <Tag icon="comment-account" text={delivery.status}
        color={colors.primaryColor}/>
        
        <Tag icon="cash" text={delivery.amount + "€"}/>
        <Tag icon="account" text={delivery.customerName}/>
        { delivery.customerPhone ?
          <Tag icon="phone" text={delivery.customerPhone}/> : null }
        <Tag icon="silverware-fork-knife" text={delivery.restaurant}/>
        <Tag icon="upload" text={"Uploaded by " + delivery.uploadUser}/>
        <Tag icon="clock" text={"Submitted at " + delivery.initTime}/>
        { delivery.readyBy ?
          <Tag icon="chef-hat" text={"Prepared by " + delivery.readyBy}/> : null }
        { delivery.readyTime ?
          <Tag icon="clock" text={"Prepared at " + delivery.readyTime}/> : null }
        { delivery.courier ?
          <Tag icon="bike" text={"Delivered by " + delivery.courier}/> : null } 
        { delivery.departureTime ?
          <Tag icon="clock" text={"Departure at " + delivery.departureTime}/> : null }
      </Box>
      <ButtonByStatus delivery={delivery}/>
    </ProfileLayout>
  );
};

const ButtonByStatus = ({delivery}) => {
  const { user } = useContext(UserContext);
  const { updateDelivery } = useContext(DeliveryContext);
  const handleReady = () => {
    delivery.status = "ready";
    delivery.readyBy = user.name;
    delivery.readyTime = new Date().toLocaleString();
    updateDelivery(delivery);
  };

  const handleDelivering = () => {
    delivery.status = "delivering";
    delivery.courier = user.name;
    delivery.departureTime = new Date().toLocaleString();
    updateDelivery(delivery);
  };

  const handleShipped = () => {
    delivery.status = "shipped";
    delivery.endTime = new Date().toLocaleString();
    updateDelivery(delivery);
  };

  switch (delivery.status) {
    case "preparing":
      return (
        <Button mx="4" colorScheme="primary"
        onPress={handleReady}
        startIcon={<Icon as={<MaterialCommunityIcons name="chef-hat" />} color="white" size="md"/>}
        >Ready to go!</Button>
      );
    case "ready":
      return (
        <Button mx="4" colorScheme="primary"
        onPress={handleDelivering}
        startIcon={<Icon as={<MaterialCommunityIcons name="bike" />} color="white" size="md"/>}
        >Deliver it!</Button>
      );
    case "delivering":
      return (
        <Button mx="4" colorScheme="primary"
        onPress={handleShipped}
        startIcon={<Icon as={<MaterialCommunityIcons name="comment-check" />} color="white" size="md"/>}
        >Delivered!</Button>
      );
    default:
      return null;
  }
};

const PostDeliveryScreen = ({navigation}) => {

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [amount, setAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [restaurant, setRestaurant] = useState(dataService.user.restaurant ?? '');
  
  const { refreshDeliveries } = useContext(DeliveryContext);

  const handleSubmit = () => {
    newDelivery({
      address: address,
      city: city,
      postcode: postcode,
      amount: amount,
      customerName: customerName,
      customerPhone: customerPhone,
      restaurant: restaurant,
      uploadUser: dataService.user._id,
      status: "preparing",
    });
    refreshDeliveries();
    navigation.navigate("DeliveryList");
  }

  return (
    <FormLayout description="Log a new delivery">
      <FormControl isRequired>
        <Input my="3" placeholder="address" value={address} onChangeText={setAddress}/>
      </FormControl>
      <FormControl isRequired>
        <Input my="3" placeholder="city" value={city} onChangeText={setCity}/>
      </FormControl>
      <FormControl isRequired>
        <Input my="3" placeholder="postcode" value={postcode} onChangeText={setPostcode}/>
      </FormControl>
      <FormControl isRequired>
        <Input my="3" placeholder="amount" value={amount} onChangeText={setAmount}/>
      </FormControl>
      <FormControl isRequired>
        <Input my="3" placeholder="customer name" value={customerName} onChangeText={setCustomerName}/>
      </FormControl>
      <FormControl isRequired>
        <Input my="3" placeholder="customer phone" value={customerPhone} onChangeText={setCustomerPhone}/>
      </FormControl>
      {/* <FormControl isRequired>
        <Input my="3" placeholder="restaurant" value={restaurant} onChangeText={setRestaurant}/>
      </FormControl> */}
      <Select width="100%" placeholder="Select restaurant"
        selectedValue={restaurant}
        onValueChange={(id) => setRestaurant(id)}
      >
        { Array.from(dataService.restaurantMap).map(
          ([id, name]) => {
            return (<Select.Item label={name} value={id} key={id}/>)
          })
        }
        <Select.Item label="Option 1" value="option1" />
        <Select.Item label="Option 2" value="option2" />
        <Select.Item label="Option 3" value="option3" />
      </Select>
      <Button mx="4" my="3" colorScheme="primary" width="100%"
      onPress={() => handleSubmit()}
      >Post delivery</Button>
    </FormLayout>
  );
};

const TripList = () => {
  const { trips } = useContext(DeliveryContext);
  return (
    <FilteredListLayout title="Trips"
    renderItem={(TripItem)}
    data={trips}
    />
  );
};

const TripItem = (props) => {
  return (
    <Box width="100%" my="2" key={props.data.id}>
      <TripCard title={"Leave at " + props.data.initTime} trip={props.data}/>
    </Box>
  );
};

export { DeliveryList, DeliveryProfile, PostDeliveryScreen, TripList, TripItem };