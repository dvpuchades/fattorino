
import React, {useState, useEffect, useContext, useRef} from "react";
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
import { hasFilter, DeliveryCityFilter, DeliveryStatusFilter, DeliveryPostcodeFilter, DeliveryCourierFilter, DeliveryRestaurantFilter } from "../components/filters.js";
import { DataContext } from "../components/data_provider.js";

const formatDate = (date) => {
  // asuming date is a string in the format "2023-05-20T12:00:00.000Z"
  date = new Date(date);
  const hoursAndMinutes = date.getHours() + ':' + date.getMinutes();
  const day = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return hoursAndMinutes + ' on ' + day;
};


const DeliveryList = ({navigation}) => {
  const statusDisclose = useDisclose();
  const cityDisclose = useDisclose();
  const postcodeDisclose = useDisclose();
  const courierDisclose = useDisclose();
  const restaurantDisclose = useDisclose();

  const { filteredDeliveries, deliveryFilters } = useContext(DataContext);

  return (
    <Box flex={1}>
      <FilteredListLayout title="Deliveries"
      data={filteredDeliveries}
      renderItem={DeliveryListItem}
      navigation={navigation}
      >
        <Button mx="2" rounded="full" margin="auto" textAlign="center"
        onPress={ () => statusDisclose.onOpen()}
        variant={hasFilter("status", deliveryFilters) ? "outline" : "solid"}>
        status
        </Button>
        <Button mx="2" rounded="full" margin="auto" textAlign="center"
        onPress= { () => cityDisclose.onOpen() }
        variant={hasFilter("city", deliveryFilters) ? "outline" : "solid"}>
        cities
        </Button>
        <Button mx="2" rounded="full" margin="auto" textAlign="center"
        onPress={ () => postcodeDisclose.onOpen() }
        variant={hasFilter("postcode", deliveryFilters) ? "outline" : "solid"}>
        postcodes
        </Button>
        <Button mx="2" rounded="full" margin="auto" textAlign="center"
        onPress={ () => courierDisclose.onOpen() }
        variant={hasFilter("courier", deliveryFilters) ? "outline" : "solid"}>
        couriers
        </Button>
        <Button mx="2" rounded="full" margin="auto" textAlign="center"
        onPress={ () => restaurantDisclose.onOpen() }
        variant={hasFilter("restaurant", deliveryFilters) ? "outline" : "solid"}>
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
    optionalText={formatDate(props.data.initTime)}
    iconByStatus={props.data.status}
    iconColor={colors.primaryColor}
    onPress={() => props.navigation.navigate("DeliveryProfile", {delivery: props.data})}
    />
  );
};

const DeliveryProfile = ({route}) => {
  const delivery = route.params.delivery;
  const subscribedToContext = useContext(DataContext);
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
        <Tag icon="clock" text={"Submitted at " + formatDate(delivery.initTime)}/>
        { delivery.cooker ?
          <Tag icon="chef-hat" text={"Prepared by " + delivery.cooker}/> : null }
        { delivery.readyTime ?
          <Tag icon="clock" text={"Prepared at " + formatDate(delivery.readyTime)}/> : null }
        { delivery.courier ?
          <Tag icon="bike" text={"Delivered by " + delivery.courier}/> : null } 
        { delivery.departureTime ?
          <Tag icon="clock" text={"Departure at " + formatDate(delivery.departureTime)}/> : null }
      </Box>
      <ButtonByStatus delivery={delivery}/>
    </ProfileLayout>
  );
};

const ButtonByStatus = ({delivery}) => {
  const { socket, user } = useContext(DataContext);

  const updateDelivery = (delivery) => {
    socket.emit('update:delivery', delivery);
  };

  const handleReady = () => {
    updateDelivery({
      _id: delivery._id,
      status: 'ready',
      cooker: user._id,
      readyTime: new Date()
    });
  };

  const handleDelivering = () => {
    updateDelivery({
      _id: delivery._id,
      status: 'delivering',
      courier: user._id,
      departureTime: new Date()
    });
  };

  const handleShipped = () => {
    updateDelivery({
      _id: delivery._id,
      status: 'shipped',
      endTime: new Date()
    });
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
  
  const { socket, user, restaurants } = useContext(DataContext);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [amount, setAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [restaurant, setRestaurant] = useState(user.restaurantId || '');

  const handleSubmit = () => {
    socket.emit('post:delivery', {
      address: address,
      city: city,
      postcode: postcode,
      amount: amount,
      customerName: customerName,
      customerPhone: customerPhone,
      restaurant: restaurant,
      brand: user.brand,
      uploadUser: user._id,
      status: "preparing",
    });
    navigation.navigate("DeliveryList");
  };

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
      <Select width="100%" placeholder="Select restaurant"
        selectedValue={restaurant}
        onValueChange={(id) => setRestaurant(id)}
      >
        { restaurants.map(
          ({_id, name}) => {
            return (<Select.Item label={name} value={_id} key={_id}/>)
          })
        }
      </Select>
      <Button mx="4" my="3" colorScheme="primary" width="100%"
      onPress={() => handleSubmit()}
      >Post delivery</Button>
    </FormLayout>
  );
};

const TripList = () => {
  const { trips } = useContext(DataContext);
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