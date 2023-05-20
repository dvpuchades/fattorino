// Dashboard
import { useContext } from "react";
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
  FormControl
} from "native-base";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Pressable, ScrollView } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { FormLayout, ProfileLayout, CreateRestaurantForm } from "../components/layouts.js";
import { ScanQRCodeScreen } from "../screens/qr_screens.js";
import { CreateBrandScreen } from "../screens/creation_screens.js";
import { StaffCard, Tag, TripCard, Option } from "../components/widgets.js";
import { ListItem } from "../components/widgets.js";
import { colors } from "../constants.js";
import { DataContext } from "../components/data_provider.js";

const OptionList = ({navigation}) => {
  const { socket, user, restaurants } = useContext(DataContext);
  return (
    <Box width="100%" flex="1">
    <Center>
      <Text fontSize="6xl">Options</Text>
    </Center>
    <Box flex="5" margin="4" justifyContent="space-around">
    <Option icon="home-group" text="restaurants"
    onPress={() => navigation.navigate("RestaurantList")}/>
    { user.restaurant ?
        <Option icon="qrcode" text="show your restaurant"
        onPress={() => 
          navigation.navigate("RestaurantProfile", {
            restaurant: () => {
              for (const restaurant of restaurants) {
                if (restaurant._id === user.restaurant) {
                  return restaurant;
                }
              }
            }
          })
        }/> : null
    }
    <Option icon="home-plus" text="add restaurant"
    onPress={() => navigation.navigate("CreateRestaurantScreen")}/>
    <Option icon="home-export-outline" text="disconnect from restaurant"
    onPress={() => {
      user.restaurant = undefined;
      socket.emit('update:staff', user);
    }}/>
    <Option icon="bug" text="report a problem"
    onPress={() => navigation.navigate("ReportScreen")}/>
    <Option icon="pound" text="version info"
    onPress={() => navigation.navigate("VersionScreen")}/>
    <Option icon="logout" text="log out"
    onPress={() => socket.emit('delete:staff', { _id: user._id })}/>
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
      <Text fontSize="6xl">Restaurants</Text>
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
  const restaurant = route.params.restaurant;
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
          <Option text="connect to restaurant" icon="home-import-outline"/>
          <Tag icon="noodles" text={restaurant.numberOfDeliveries + " deliveries"}/>
          <Tag icon="account-group" text={restaurant.activeUsers + " active members"}/>
          <Tag icon="calendar-plus" text={"posted on " + formatDate(restaurant.creationDate)}/>
          <Tag icon="home-plus" text={ "posted by " + restaurant.creatorName}/>
          <Tag icon="map-marker" text={restaurant.address}/>
          <Tag icon="city-variant" text={restaurant.city + ", " + restaurant.postcode}/>
          <Option text="remove restaurant" icon="home-minus"/>
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
      <Tag icon="pound" text="version 0.0.1"/>
      <Tag icon="server" text="standalone build"/>
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