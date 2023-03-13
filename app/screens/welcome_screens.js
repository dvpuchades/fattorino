import {
  Input,
  Button
} from "native-base";
import { FormLayout } from '../components/layouts.js';

const SignUpScreen = ({navigation}) => {
  return (
    <FormLayout description="Join us and improve your efficency when shipping.">
      <Input my="5" variant="filled" placeholder="email"/>
      <Input my="5" variant="filled" placeholder="phone number"/>
      <Input my="5" variant="filled" placeholder="name"/>
      <Input my="5" type="password" variant="filled" placeholder="password"/>
      <Button my="5" colorScheme="primary" width="100%"
        onPress={() =>
          navigation.navigate('ScanQRCodeScreen')
        }
      >Sign Up</Button>
      <Button my="5" variant="link"
        width="100%"
        onPress={() =>
          navigation.navigate('LogInScreen')
        }
      >Do you already have an account? Log in!</Button>
    </FormLayout>
  );
};

const LogInScreen = ({navigation}) => {
  return (
    <FormLayout description="Log in and start delivering.">
      <Input variant="filled" placeholder="email" my="5"/>
      <Input type="password" variant="filled" placeholder="password" my="5"/>
      <Button colorScheme="primary" width="100%" my="5"
        onPress={() =>
          navigation.navigate('ScanQRCodeScreen')
        }
      >Log In</Button>
      <Button variant="link" my="5"
        width="100%"
        onPress={() =>
          navigation.navigate('SignUpScreen')
        }
      >Don't you have an account yet? Sign up!</Button>
    </FormLayout>
  );
}

export { LogInScreen, SignUpScreen };