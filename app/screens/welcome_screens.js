import React, { useState } from 'react';
import {
  Input,
  Button
} from "native-base";
import { FormLayout } from '../components/layouts.js';
import { register } from '../services/socket_handler.js';

const SignUpScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  return (
    <FormLayout description="Join us and improve your efficency when shipping.">
      <Input my="5" variant="filled" placeholder="email" onChange={(event) => setEmail(event.target.value)}/>
      <Input my="5" variant="filled" placeholder="phone number" onChange={(event) => setPhoneNumber(event.target.value)}/>
      <Input my="5" variant="filled" placeholder="name" onChange={(event) => setName(event.target.value)}/>
      <Input my="5" type="password" variant="filled" placeholder="password" onChange={(event) => setPassword(event.target.value)}/>
      <Button my="5" colorScheme="primary" width="100%"
        onPress={() => {
            register({email, phoneNumber, name, password});
            navigation.navigate('ScanQRCodeScreen');
          }
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