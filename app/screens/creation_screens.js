import React, { useState } from "react";
import {Button, Input} from "native-base";
import { FormLayout, CreateRestaurantForm } from "../components/layouts.js";
import { SocketContext } from "../services/socket_provider.js";
import { Brand } from "../services/models.js";

const CreateBrandScreen = ({navigation}) => {
  const [brandName, setBrandName] = useState('');
  const { createBrand } = useContext(SocketContext);
  return (
    <FormLayout description="Enter your restaurants brand or the name of your chain restaurant.">
      <Input my="5" placeholder="brand name"
      onChangeText={(value) => setBrandName(value)}
      value={brandName}/>
      <Button my="5" colorScheme="primary"
      width="100%"
      onPress={() => {
          createBrand(new Brand(brandName))
            .then(() => navigation.navigate('CreateRestaurantScreen'))
            .catch((error) => console.log(error));
        }
      }
      >Register Brand</Button>
    </FormLayout>
  );
};

const CreateFirstRestaurantScreen = ({navigation}) => {
  const { createFirstRestaurant } = useContext(SocketContext);
  const submitRestaurant = (restaurant) => {
    createFirstRestaurant(restaurant)
      .then(() => navigation.navigate("DashboardScreen"))
      .catch((error) => console.log(error));
  };
  return (
    <CreateRestaurantForm onSubmit={(restaurant) => submitRestaurant(restaurant)}/>
  );
};


export { CreateBrandScreen, CreateFirstRestaurantScreen };