// Dashboard
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Pressable, ScrollView } from "react-native";
import QRCode from "react-native-qrcode-svg";
import React, {useEffect} from "react";
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
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  DMSerifDisplay_400Regular
} from '@expo-google-fonts/dm-serif-display';
import {
  Manrope_200ExtraLight,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  LogInScreen,
  SignUpScreen
} from '../screens/welcome_screens.js';
import { colors, styles } from '../constants.js';
import { FormLayout, FilteredListLayout, ProfileLayout } from "../components/layouts.js";
import { ScanQRCodeScreen } from "../screens/qr_screens.js";
import { CreateBrandScreen } from "../screens/creation_screens.js";
import { StaffCard, Tag, TripCard, Option } from "../components/widgets.js";
import { StaffList, StaffProfile } from "../screens/staff_screens.js";
import { ListItem } from "../components/widgets.js";
import {
  DeliveryList,
  DeliveryProfile,
  PostDeliveryScreen,
  TripList
} from "../screens/delivery_screens.js";
import { OptionList, CreateRestaurantScreen, RestaurantList, RestaurantProfile, ReportScreen, VersionScreen } from "../screens/options_screens.js";
import { DeliveryFilterProvider, StaffFilterProvider } from '../components/filter_providers.js';

// Set stack navigator
const Tab = createBottomTabNavigator();
const StaffStack = createNativeStackNavigator();
const DeliveryStack = createNativeStackNavigator();
const TripStack = createNativeStackNavigator();
const OptionStack = createNativeStackNavigator();            

const DashboardScreen = ({navigation}) => {
  useEffect(
    () => {
      navigation.addListener('beforeRemove', (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
      });
    },
    [navigation]
  );
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primaryColor,
      tabBarStyle: { height: 70, paddingBottom: 15, paddingTop: 15 }
    }}>
      <Tab.Screen name="Staff" component={StaffScreen}
      options={{tabBarIcon: ({color, size}) => (
        <MaterialCommunityIcons name="account-group" color={color} size={size}/>
      )}}
      />
      <Tab.Screen name="Deliveries" component={DeliveriesScreen}
      options={{tabBarIcon: ({color, size}) => (
        <MaterialCommunityIcons name="noodles" color={color} size={size}/>
      )}}
      />
      <Tab.Screen name="Trips" component={TripScreen}
      options={{tabBarIcon: ({color, size}) => (
        <MaterialCommunityIcons name="map-marker-path" color={color} size={size}/>
      )}}
      />
      <Tab.Screen name="Options" component={OptionsScreen}
      options={{tabBarIcon: ({color, size}) => (
        <MaterialCommunityIcons name="menu" color={color} size={size}/>
      )}}
      />
    </Tab.Navigator>
  );
};

const StaffScreen = () => {
  return (
    <StaffFilterProvider>
      <StaffStack.Navigator screenOptions={{ headerShown: false }}>
        <StaffStack.Screen name="StaffList" component={StaffList}/>
        <StaffStack.Screen name="StaffProfile" component={StaffProfile}/>
      </StaffStack.Navigator>
    </StaffFilterProvider>
  );
};

const DeliveriesScreen = () => {
  return (
    <DeliveryFilterProvider>
      <DeliveryStack.Navigator screenOptions={{ headerShown: false }}>
        <DeliveryStack.Screen name="DeliveryList" component={DeliveryList}/>
        <DeliveryStack.Screen name="DeliveryProfile" component={DeliveryProfile}/>
        <DeliveryStack.Screen name="PostDeliveryScreen" component={PostDeliveryScreen}/>
      </DeliveryStack.Navigator>
    </DeliveryFilterProvider>
  );
};

const TripScreen = () => {
  return (
    <TripStack.Navigator screenOptions={{ headerShown: false }}>
      <TripStack.Screen name="TripList" component={TripList}/>
    </TripStack.Navigator>
  );
};

const OptionsScreen = () => {
  return (
    <OptionStack.Navigator screenOptions={{ headerShown: false }}>
      <OptionStack.Screen name="OptionList" component={OptionList}/>
      <OptionStack.Screen name="TripList" component={TripList}/>
      <OptionStack.Screen name="RestaurantList" component={RestaurantList}/>
      <OptionStack.Screen name="RestaurantProfile" component={RestaurantProfile}/>
      <OptionStack.Screen name="CreateRestaurantScreen" component={CreateRestaurantScreen}/>
      <OptionStack.Screen name="ScanQRCodeScreen" component={ScanQRCodeScreen}/>
      <OptionStack.Screen name="ReportScreen" component={ReportScreen}/>
      <OptionStack.Screen name="VersionScreen" component={VersionScreen}/>
      <OptionStack.Screen name="LogInScreen" component={LogInScreen}/>
    </OptionStack.Navigator>
  );
};

export default DashboardScreen;