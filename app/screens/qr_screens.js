import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Center, VStack, Button, Text, Spacer } from 'native-base';
// https://docs.expo.io/versions/latest/sdk/bar-code-scanner/
import { BarCodeScanner } from 'expo-barcode-scanner';
import { SocketContext } from '../services/socket_provider';
import { UserContext } from '../components/context_providers';

const ScanQRCodeScreen = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const getBarcodeScannerPermissions = async () => {
      if (isMounted) {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      }
    };

    getBarcodeScannerPermissions();

    // set scanned to false when the screen gets mounted
    setScanned(false);
    return () => { isMounted = false };
  }, [scanned]);

  const { connectToRestaurant } = useContext(SocketContext);
  const { setNeedsRestaurant } = useContext(UserContext);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    connectToRestaurant(data)
      .then(() => {
        console.log("Connected to restaurant");
        // navigation.navigate("DashboardScreen");
        setNeedsRestaurant(false);
      });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Center px="4">
      <VStack px="4" width="100%" height="100%">
      <Spacer flex="1"/>
      <Text flex="1" fontSize="6xl" textAlign="center">
        Scan QR
      </Text>
      <Button flex="1" variant="link" my="5"
        width="100%"
      >Don't you know where to find it? Tap here!</Button>
      <View flex="6">
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      </View>
      <Button flex="1" variant="link" my="5"
        width="100%"
        onPress={() => navigation.navigate('CreateBrandScreen')}
      > Do you manage a restaurant? Get started!
      </Button>
      <Spacer flex="2"/>
      </VStack>
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </Center>
  );
}

export { ScanQRCodeScreen };