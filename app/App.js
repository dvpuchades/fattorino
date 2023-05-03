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
} from './screens/welcome_screens.js';
import { colors, styles } from './constants.js';
import { FormLayout, FilteredListLayout, ProfileLayout, CreateRestaurantForm } from "./components/layouts.js";
import { ScanQRCodeScreen } from "./screens/qr_screens.js";
import { CreateBrandScreen, CreateFirstRestaurantScreen } from "./screens/creation_screens.js";
import { StaffCard, Tag, TripCard, Option } from "./components/widgets.js";
import { StaffList, StaffProfile } from "./screens/staff_screens.js";
import { ListItem } from "./components/widgets.js";
import {
  DeliveryList,
  DeliveryProfile,
  PostDeliveryScreen,
  TripList
} from "./screens/delivery_screens.js";
import DashboardScreen from "./screens/dashboard_screens.js";
import { SocketContext, SocketProvider } from "./services/socket_provider.js";
import { UserContext, UserProvider } from "./components/context_providers.js";

// Define the config
const config = {
  useSystemColorMode: false
};

// extend the theme
export const theme = extendTheme({ colors, config, fonts:
  { heading: 'DMSerifDisplay_400Regular', body: 'Manrope_400Regular' }
});


// Set stack navigator
const Stack = createNativeStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
    Manrope_400Regular
  });
  if (!fontsLoaded)
  {
    return <AppLoading />;
  }
  else
  {
    return (
      <UserProvider>
      <SocketProvider>
      <NativeBaseProvider theme={theme}>
        <RootNavigator/>
      </NativeBaseProvider>
      </SocketProvider>
      </UserProvider>
    );
  }
}

const RootNavigator = () => {
  const { user, needsRestaurant } = useContext(UserContext);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        { user ?
        <>
        { needsRestaurant ?
          <>
          <Stack.Screen name="ScanQRCodeScreen" component={ScanQRCodeScreen}/>
          <Stack.Screen name="CreateBrandScreen" component={CreateBrandScreen}/>
          <Stack.Screen name="CreateRestaurantScreen" component={CreateFirstRestaurantScreen}/>
          </> :
          <Stack.Screen name="DashboardScreen" component={DashboardScreen}/>
        }
        </>
        :
        <>
        <Stack.Screen name="LogInScreen" component={LogInScreen}/>
        <Stack.Screen name="SignUpScreen" component={SignUpScreen}/>
        </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}
