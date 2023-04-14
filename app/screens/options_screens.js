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
import { FormLayout, FilteredListLayout, ProfileLayout, CreateRestaurantForm } from "../components/layouts.js";
import { ScanQRCodeScreen } from "../screens/qr_screens.js";
import { CreateBrandScreen } from "../screens/creation_screens.js";
import { StaffCard, Tag, TripCard, Option } from "../components/widgets.js";
import { ListItem } from "../components/widgets.js";
import { RestaurantContext, RestaurantProvider } from "../components/context_providers.js";
import { colors } from "../constants.js";

const OptionList = ({navigation}) => {
  return (
    <Box width="100%" flex="1">
    <Center>
      <Text fontSize="6xl">Options</Text>
    </Center>
    <Box flex="5" margin="4" justifyContent="space-around">
    <Option icon="home-group" text="restaurants"
    onPress={() => navigation.navigate("RestaurantList")}/>
    <Option icon="qrcode" text="show QR code"
    onPress={() => 
      navigation.navigate("ShowQRCodeScreen", {restaurant: {id: "1", name: "TODO"}})}/>
    <Option icon="home-plus" text="add restaurant"
    onPress={() => navigation.navigate("CreateRestaurantScreen")}/>
    <Option icon="home-export-outline" text="disconnect from restaurant"
    onPress={() => navigation.navigate("ScanQRCodeScreen")}/>
    <Option icon="bug" text="report a problem"
    onPress={() => navigation.navigate("ReportScreen")}/>
    <Option icon="pound" text="version info"
    onPress={() => navigation.navigate("VersionScreen")}/>
    <Option icon="logout" text="log out"
    onPress={() => navigation.navigate("LogInScreen")}/>
    </Box>
    </Box>
  );
};

const ShowQRCodeScreen = ({ route }) => {
  const restaurant = route.params.restaurant;
  return (
    <FormLayout description={"QR Code for " + restaurant.name}>
      <QRCode value={restaurant.id}/>
    </FormLayout>
  );
};

// Another version of this Screen is used on login
const CreateRestaurantScreen = ({navigation}) => {
  const { addRestaurant } = useContext(RestaurantContext);
  const submitRestaurant = (restaurant) => {
    addRestaurant(restaurant);
    navigation.navigate("RestaurantList");
  };

  return (
    <CreateRestaurantForm onSubmit={(restaurant) => submitRestaurant(restaurant)}/>
  );
};


const RestaurantList = ({navigation}) => {
  const { restaurants, setRestaurants } = useContext(RestaurantContext);
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
    <Box px="4">
    </Box>
    </Box>
  );
};

const RestaurantProfile = ({ route }) => {
  const restaurant = route.params.restaurant;
  return (
    <ProfileLayout title={restaurant.name}>
        <Center mb="5">
          <QRCode value={restaurant.id}/>
        </Center>
        <Box mx="4">
          <Option text="connect to restaurant" icon="home-import-outline"/>
          <Tag icon="noodles" text={restaurant.numberOfDeliveries + " deliveries"}/>
          <Tag icon="account-group" text={restaurant.activeUsers + " active members"}/>
          <Tag icon="calendar-plus" text={"posted on " + restaurant.uploadDate}/>
          <Tag icon="home-plus" text={ "posted by " + restaurant.uploadUser}/>
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
  ShowQRCodeScreen,
  RestaurantList,
  RestaurantProfile,
  ReportScreen,
  CreateRestaurantScreen,
  VersionScreen
}