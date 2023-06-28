import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Center, VStack, Button, Text, Spacer, Input } from 'native-base';
// https://docs.expo.io/versions/latest/sdk/bar-code-scanner/
import { BarCodeScanner } from 'expo-barcode-scanner';
import { DataContext } from '../components/data_provider.js';
import { storeData } from '../utils/storage.js';
import { FormLayout } from '../components/layouts.js';

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
    socket.emit('post:staff', {
      user,
      restaurant: data
    });
    storeData('restaurant', data);
    setScanned(true);
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
      <Text flex="1" fontSize="4xl" textAlign="center">
        Scan QR
      </Text>
      <Button flex="1" variant="link" my="5"
        width="100%"
        onPress={() => navigation.navigate('ExplainQRCodeScreen')}
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
      {scanned &&
        <Button flex="1" onPress={() => setScanned(false)} width="100%">
          Tap to Scan Again
        </Button>
      }
      <Spacer flex="2"/>
      </VStack>
    </Center>
  );
}

const ExplainQRCodeScreen = ({navigation}) => {
  const [accessCode, setAccessCode] = useState('');
  const { socket, user } = useContext(DataContext);

  const handleAccess = () => {
    socket.emit('post:staff', {
      user,
      restaurant: accessCode
    });
    storeData('restaurant', accessCode);
  };

  return (
    <FormLayout description="A brief introduction to restaurant access.">
      <Text my="4" textAlign="justify">
        QR codes are used to access restaurants.
        If you want to access a restaurant, you need to scan its QR code. 
      </Text>
      <Text my="4" textAlign="justify">
        You will need to ask a mate for the QR code of your restaurant.
        He can find it in the restaurant profile. 
      </Text>
      <Text my="4" textAlign="justify">
        If you can't scan the QR code, you can also enter the restaurant
        code access manually below. This code is also available in the
        restaurant profile. 
      </Text>
      <Input my="5" placeholder="brand name"
      onChangeText={(value) => setAccessCode(value)}
      value={accessCode}/>
      <Button my="5" colorScheme="primary"
      width="100%"
      onPress={() => handleAccess() }
      >Register Brand</Button>
    </FormLayout>
  );
};

export { ScanQRCodeScreen, ExplainQRCodeScreen };