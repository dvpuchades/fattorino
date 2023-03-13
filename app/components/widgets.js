import {
  Text,
  VStack,
  HStack,
  Box,
  Center
} from "native-base";
import { colors } from '../constants.js';
import { Pressable } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ListItem = (props) => {
  return (
    <Pressable onPress={ props.onPress }>
      <Box>
        <HStack width="100%" mt="10" px="4">
          <VStack flex="3">
            <Text flex="1" fontSize="xl"
              style={{
                fontWeight: "bold"
              }}
            >{props.principalText}</Text>
            <Text flex="1" fontSize="xl">{props.secondaryText}</Text>
            { props.optionalText ? <Text flex="1" fontSize="xl">{props.optionalText}</Text> : null}
          </VStack>
          <Box flex="1" alignItems="center" justifyContent="center">
            {
              props.iconByStatus ?
                <IconByStatus status={props.iconByStatus} iconColor={props.iconColor}/>
              : <MaterialCommunityIcons color={props.iconColor} size={30}
                name={props.iconName} />
            }
          </Box>
        </HStack>
      </Box>
    </Pressable>
  );
};

const Tag = (props) => {
  return (
    <HStack my="2">
      <Box mr="2">
      <MaterialCommunityIcons size={30} name={props.icon}
      color={props.color ? props.color : "black"}/>
      </Box>
      <Text fontSize="xl"
      color={props.color ? props.color : "black"}>
        {props.text}
      </Text>
    </HStack>
  );
};

const TripCard = (props) => {
  return (
    <Box rounded="md" bgColor="gray.200" mx="4" padding="4">
      <Center>
        <Text fontSize="xl">
          { props.title }
        </Text>
      </Center>
      { props.trip.deliveries.map((delivery, index) => {
        return (
          <HStack my="2" key={index}>
            <VStack flex="5">
              <Text fontSize="xl"
              style={{
                fontWeight: "bold"
              }}
              >{delivery.address}</Text>
              <Text fontSize="xl">{delivery.initTime}</Text>
            </VStack>
            <Box flex="1" alignItems="center" justifyContent="center">  
              <IconByStatus status={delivery.status}/>
            </Box>
          </HStack>
        )})
      }
      <Center>
      <Option text="mark to deliver & open" icon="transit-detour"/>
      </Center>
      </Box>
  );
};

const Option = (props) => {
  return (
    <Pressable onPress={props.onPress}>
    <HStack my="2" width="100%">
      <Box mr="2" justifyContent="space-between">
      <MaterialCommunityIcons size={30} name={props.icon}/>
      </Box>
      <Text fontSize="xl">
        {props.text}
      </Text>
      <Box ml="2">
      <MaterialCommunityIcons size={30} name="chevron-right" color="gray"/>
      </Box>
    </HStack>
    </Pressable>
  );
};

const IconByStatus = (props) => {
  switch (props.status) {
    case "preparing":
      return <MaterialCommunityIcons color={props.iconColor} size={30}
        name="chef-hat"/>;
    case "ready":
      return <MaterialCommunityIcons color={props.iconColor} size={30}
        name="shopping"/>;
    case "delivering":
      return <MaterialCommunityIcons color={props.iconColor} size={30}
        name="bike"/>;
    case "shipped":
      return <MaterialCommunityIcons color={props.iconColor} size={30}
        name="noodles"/>;
    default:
      return <MaterialCommunityIcons color={props.iconColor} size={30}
        name="comment-question"/>;
  }
};

export { ListItem, Tag, TripCard, Option };