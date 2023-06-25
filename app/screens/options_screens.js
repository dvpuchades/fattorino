// Dashboard
import { useRef, useState, useEffect, useContext } from "react";
import { ScrollView } from "react-native";
import {
  Text,
  Button,
  Center,
  Input,
  Box
} from "native-base";
import QRCode from "react-native-qrcode-svg";
import { FormLayout, ProfileLayout, CreateRestaurantForm } from "../components/layouts.js";
import { Tag, Option } from "../components/widgets.js";
import { ListItem } from "../components/widgets.js";
import { colors } from "../constants.js";
import { DataContext } from "../components/data_provider.js";
import { removeData } from "../utils/storage.js";

const OptionList = ({navigation}) => {
  const {
    socket,
    user,
    userBackToAuth,
    logOut,
    restaurants
  } = useContext(DataContext);

  const userRestaurant = useRef();

  useEffect(() => {
    if (user.restaurant) {
      userRestaurant.current = restaurants.find(
        (item) => item.name === user.restaurant
      );
    }
  }, [user, restaurants]);

  return (
    <Box width="100%" flex="1">
    <Center>
      <Text fontSize="5xl">Options</Text>
    </Center>
    <Box flex="5" margin="4" justifyContent="space-around">
    <Option icon="home-group" text="restaurants"
    onPress={() => navigation.navigate("RestaurantList")}/>
    { user.restaurant ?
        <Option icon="qrcode" text="my restaurant"
        onPress={() => 
          navigation.navigate("RestaurantProfile", {
            restaurant: userRestaurant.current
          })
        }/> : null
    }
    <Option icon="home-plus" text="add restaurant"
    onPress={() => navigation.navigate("CreateRestaurantScreen")}/>
    { user.restaurant ?
      <Option icon="home-export-outline" text="disconnect from restaurant"
      onPress={() => {
        removeData('restaurant');
        if (user.position === 'manager') {
          user.restaurant = undefined;
          socket.emit('update:staff', user);
        }
        else {
          socket.emit('delete:staff', { _id: user._id });
          userBackToAuth();
        }
      }}/> : null
    }
    <Option icon="bug" text="report a problem"
    onPress={() => navigation.navigate("ReportScreen")}/>
    <Option icon="pound" text="version info"
    onPress={() => navigation.navigate("VersionScreen")}/>
    <Option icon="logout" text="log out"
    onPress={() => {
      removeData('user');
      removeData('restaurant');
      removeData('brand');
      socket.emit('delete:staff', { _id: user._id });
      logOut();
    }}/>
    </Box>
    </Box>
  );
};

// Another version of this Screen is used on login
const CreateRestaurantScreen = ({navigation}) => {
  const { socket } = useContext(DataContext);
  const submitRestaurant = (restaurant) => {
    socket.emit('post:restaurant', restaurant);
    navigation.navigate("RestaurantList");
  };

  return (
    <CreateRestaurantForm onSubmit={(restaurant) => submitRestaurant(restaurant)}/>
  );
};


const RestaurantList = ({navigation}) => {
  const { restaurants } = useContext(DataContext);
  return (
    <Box width="100%" flex="1">
    <Center>
      <Text fontSize="5xl">Restaurants</Text>
    </Center>
    <Box flex="5">
    <ScrollView>
    {restaurants.map((item) => (
      <RestaurantListItem key={item._id} item={item}
      navigation={navigation}/>
    ))}
    </ScrollView>
    </Box>
    </Box>
  );
};

const RestaurantListItem = (props) => {
  return (
    <Box width="100%">
    <ListItem key={props.item.id} principalText={props.item.name}
    secondaryText={ props.item.address }
    optionalText={ props.item.city + ", " + props.item.postcode }
    iconName="home"
    onPress={() => props.navigation.navigate("RestaurantProfile",
    {restaurant: props.item})}/>
    <Box px="4"/>
    </Box>
  );
};

const RestaurantProfile = ({ route }) => {
  const restaurantToShow = route.params.restaurant;
  const [restaurant, setRestaurant] = useState(restaurantToShow);

  // subscribe to changes in the data
  const { restaurants } = useContext(DataContext);
  useEffect(() => {
    for (const r of restaurants) {
      if (r._id === restaurantToShow._id) {
        setRestaurant(r);
        break;
      }
    }
  }, [restaurants]);

  const formatDate = (date) => {
    // assumes date is a string
    date = new Date(date);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ProfileLayout title={restaurant.name}>
        <Center mb="5">
          <QRCode value={restaurant._id}/>
        </Center>
        <Box mx="4">
          {/* <Option text="connect to restaurant" icon="home-import-outline"/> */}
          <Tag icon="noodles" text={restaurant.numberOfDeliveries + " deliveries shipped today"}/>
          <Tag icon="account-group" text={restaurant.activeUsers + " active members"}/>
          <Tag icon="calendar-plus" text={"posted on " + formatDate(restaurant.creationDate)}/>
          <Tag icon="home-plus" text={ "posted by " + restaurant.creatorName}/>
          <Tag icon="map-marker" text={restaurant.address}/>
          <Tag icon="city-variant" text={restaurant.city + ", " + restaurant.postcode}/>
          {/* <Option text="remove restaurant" icon="home-minus"/> */}
        </Box>
    </ProfileLayout>
  );
};


const ReportScreen = () => {
  return (
    <FormLayout description="Let us know how to improve Fattorino">
      <Input placeholder="propose any enhancement or describe a problem"
      multiline numberOfLines={15} margin="4" width="100%"/>
      <Button margin="4" width="100%">Submit</Button>
    </FormLayout>
  );
};

const VersionScreen = () => {
  return (
    <FormLayout description="Some information about your current version">
      <Box width="100%">
      <Tag icon="pound" text="mvp"/>
      <Tag icon="server" text="23.0.1 server"/>
      <Tag icon="database" text="development database"/>
      <Tag icon="heart" text="made by dvpuchades" color={colors.primaryColor}/>
      </Box>
    </FormLayout>
  );
};

export {
  OptionList,
  RestaurantList,
  RestaurantProfile,
  ReportScreen,
  CreateRestaurantScreen,
  VersionScreen
}