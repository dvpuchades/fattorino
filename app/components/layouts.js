import { useState, useContext } from "react";
import {
  Text,
  Center,
  VStack,
  Spacer,
  FlatList,
  ScrollView,
  Box,
  Heading,
  Button,
  Input
} from "native-base";
import { styles } from '../constants.js';

const FormLayout = (props) => {
  return (
      <ScrollView mt="20" px="4" width="100%" height="100%">
          <Center flex="1">
            <Text fontSize="6xl" textAlign="center" style={styles.logo}>
                fattorino
            </Text>
          <Text style={styles.text} mb="3">{ props.description }</Text>
          </Center>
          <Center flex="3">
          { props.children }
          </Center>
          <Spacer flex="1"/>
      </ScrollView>
  );
};

// Data displayed in this list will be passed as props.data,
// they will be rendered using props.renderItem.
// Filters to be added inside the component (props.children)
// Title to be declared through props.title
const FilteredListLayout = (props) => {
  return (
    <Box width="100%" flex="1" mt="10">
    <Center>
      <Text fontSize="6xl">{ props.title }</Text>
      <ScrollView width="100%" horizontal
      showsHorizontalScrollIndicator={false}>
        { props.children }
      </ScrollView>
    </Center>
    <Box flex="5">
    <FlatList px="4" data={props.data}
    contentContainerStyle={{ paddingBottom: 50 }}
    renderItem={
      ({item}) => props.renderItem({data: item, navigation: props.navigation})
    }/>
    </Box>
    </Box>
  );
};

const ProfileLayout = (props) => {
  return (
    <ScrollView width="100%" flex="1" mt="10">
      <Center mb="4">
        <Heading fontSize="4xl">{ props.title }</Heading>
        <Text fontSize="xl">
          { props.subtitle }
        </Text>
      </Center>
      { props.children }
    </ScrollView>
  );
};

const CreateRestaurantForm = (props) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const { user } = useContext(AuthContext);
  
  const handleSubmit = () => {
    const restaurant = {
      id: Math.random().toString(),
      name: name,
      address: address,
      city: city,
      postcode: postcode,
      uploadUser: user.name,
      initTime: new Date().toLocaleString(),
    }
    props.onSubmit(restaurant);
  }

  return (
    <FormLayout description="Enter your restaurants details.">
      <Input my="5" placeholder="restaurant name" value={name} onChangeText={setName}/>
      <Input my="5" placeholder="address" value={address} onChangeText={setAddress}/>
      <Input my="5" placeholder="city" value={city} onChangeText={setCity}/>
      <Input my="5" placeholder="postcode" value={postcode} onChangeText={setPostcode}/>
      <Button my="5" colorScheme="primary" width="100%"
      onPress={() => handleSubmit()}
      >Register Restaurant</Button>
    </FormLayout>
  );
};

export { FormLayout, FilteredListLayout, ProfileLayout, CreateRestaurantForm };