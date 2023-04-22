import React, { useState } from 'react';
import {
  Input,
  Button
} from "native-base";
import { FormLayout } from '../components/layouts.js';
import { register, authenticate } from '../services/socket_handler.js';

const SignUpScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  return (
    <FormLayout description="Join us and improve your efficency when shipping.">
      <Input my="5" variant="filled" placeholder="email"
        onChangeText={(value) => setEmail(value)}
        value={email}/>
      <Input my="5" variant="filled" placeholder="phone number"
        onChangeText={(value) => setPhone(value)}
        value={phone}/>
      <Input my="5" variant="filled" placeholder="name"
        onChangeText={(value) => setName(value)}
        value={name}/>
      <Input my="5" type="password" variant="filled" placeholder="password"
        onChangeText={(value) => setPassword(value)}
        value={password}/>
      <Button my="5" colorScheme="primary" width="100%"
        onPress={() => {
            register({email, phone, name, password})
              .then(() => navigation.navigate('ScanQRCodeScreen'))
              .catch((error) => console.log(error));
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <FormLayout description="Log in and start delivering.">
      <Input variant="filled" placeholder="email" my="5"
        onChangeText={(value) => setEmail(value)}
        value={email}/>
      <Input type="password" variant="filled" placeholder="password" my="5"
        onChangeText={(value) => setPassword(value)}
        value={password}/>
      <Button colorScheme="primary" width="100%" my="5"
        onPress={() => {
            authenticate({email, password})
              .then(() => navigation.navigate('ScanQRCodeScreen'))
              .catch((error) => console.log(error));
          }
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