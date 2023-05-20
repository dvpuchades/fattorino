import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Center, VStack, Button, Text, Spacer } from 'native-base';
// https://docs.expo.io/versions/latest/sdk/bar-code-scanner/
import { BarCodeScanner } from 'expo-barcode-scanner';
import { DataContext } from '../components/data_provider.js';

const ScanQRCodeScreen = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { socket, user } = useContext(DataContext);

  useEffect(() => {
    const getBarcodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    getBarcodeScannerPermissions();

    // set scanned to false when the screen gets unmounted
    // return () => setScanned(false);
  }, [scanned]);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    socket.emit('post:staff', {
      user,
      restaurant: data
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