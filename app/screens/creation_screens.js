import React, { useState, useContext } from "react";
import {Button, Input} from "native-base";
import { FormLayout, CreateRestaurantForm } from "../components/layouts.js";
import { DataContext } from "../components/data_provider.js";

const CreateBrandScreen = ({navigation}) => {
  const [brandName, setBrandName] = useState('');
  const { socket, user } = useContext(DataContext);
  
  return (
    <FormLayout description="Enter your restaurants brand or the name of your chain restaurant.">
      <Input my="5" placeholder="brand name"
      onChangeText={(value) => setBrandName(value)}
      value={brandName}/>
      <Button my="5" colorScheme="primary"
      width="100%"
      onPress={() => {
          const brand = {
            name: brandName,
            creator: user
          };
          socket.emit('post:brand', brand);
          socket.once('post:brand', (brand) => {
            navigation.navigate('CreateRestaurantScreen');
          });
        }
      }
      >Register Brand</Button>
    </FormLayout>
  );
};

const CreateFirstRestaurantScreen = ({navigation}) => {
  const { socket } = useContext(DataContext);
  return (
    <CreateRestaurantForm onSubmit={(restaurant) => {
      socket.emit('post:restaurant', restaurant);
    }}/>
  );
};


export { CreateBrandScreen, CreateFirstRestaurantScreen };