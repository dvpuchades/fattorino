import {Button, Input} from "native-base";
import { FormLayout, CreateRestaurantForm } from "../components/layouts.js";

const CreateBrandScreen = ({navigation}) => {
  return (
    <FormLayout description="Enter your restaurants brand or the name of your chain restaurant.">
      <Input my="5" placeholder="brand name"/>
      <Button my="5" colorScheme="primary"
      width="100%"
      onPress={() => navigation.navigate('CreateRestaurantScreen')}
      >Register Brand</Button>
    </FormLayout>
  );
};

const CreateFirstRestaurantScreen = ({navigation}) => {
  const submitRestaurant = (restaurant) => {
    navigation.navigate("DashboardScreen");
  };

  return (
    <CreateRestaurantForm onSubmit={(restaurant) => submitRestaurant(restaurant)}/>
  );
};


export { CreateBrandScreen, CreateFirstRestaurantScreen };