import React, {useState, useEffect, useContext, useRef} from "react";
import {
  NativeBaseProvider,
  extendTheme
} from "native-base";
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  DMSerifDisplay_400Regular
} from '@expo-google-fonts/dm-serif-display';
import { Manrope_400Regular } from '@expo-google-fonts/manrope';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  LogInScreen,
  SignUpScreen
} from './screens/welcome_screens.js';
import { colors, styles } from './constants.js';
import { ExplainQRCodeScreen, ScanQRCodeScreen } from "./screens/qr_screens.js";
import { CreateBrandScreen, CreateFirstRestaurantScreen } from "./screens/creation_screens.js";
import DashboardScreen from "./screens/dashboard_screens.js";
import { DataContext, DataProvider } from "./components/data_provider.js";
import { ErrorAlert } from "./components/widgets.js";

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
      <DataProvider>
      <NativeBaseProvider theme={theme}>
        <RootNavigator/>
      </NativeBaseProvider>
      </DataProvider>
    );
  }
}

const RootNavigator = () => {
  const { user, error } = useContext(DataContext);

  return (
    <NavigationContainer>
      <ErrorAlert error={error}/>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        { user ?
        <>
        { (user.position !== "manager" && !user.restaurant) ?
          <>
          <Stack.Screen name="ScanQRCodeScreen" component={ScanQRCodeScreen}/>
          <Stack.Screen name="ExplainQRCodeScreen" component={ExplainQRCodeScreen}/>
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
