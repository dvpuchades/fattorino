import io from 'socket.io-client';
import { server } from '../environment.js';
const socket = io(server.uri);

import dataService from "./data_service";

socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
});

socket.on('newDelivery', (data) => {
  console.log('New delivery:', data);
  if (data.created) {
    dataService.createDelivery(data.delivery);
  } else {
    console.log('Error creating delivery:', data.error);
  }
});

socket.on('updateDelivery', (data) => {
  if (data.updated) {
    dataService.updateDelivery(data.delivery);
  } else {
    console.log('Error updating delivery:', data.error);
  }
});

async function register(user) {
  const response = new Promise ((resolve, reject) => {
    socket.once('register', (response) => {
      if (response.registered) {
        dataService.user = response.user;
        resolve();
      } else {
        reject(response.error);
      }
    });
  });
  await socket.emit('register', {user});
  await response;
}

async function authenticate({email, password}) {
  const response = new Promise((resolve, reject) => {
    socket.once('auth', (response) => {
      if (response.authenticated) {
        dataService.user = response.user;
        resolve();
      } else {
        reject(response.error);
      }
    });
  });
  const user = { email, password };
  await socket.emit('auth', {user});
  await response;
}

async function createBrand(brand) {
  const response = new Promise((resolve, reject) => {
    socket.once('createBrand', (response) => {
      if (response.created) {
        dataService.user.brand = response.brand;
        resolve();
      } else {
        reject(response.error);
      }
    });
  });
  await socket.emit('createBrand', {brand});
  await response;
}

const initializeClientPromise = new Promise((resolve, reject) => {
  socket.once('initializeClient', (response) => {
    console.log('Response: ', response);
    if (response.created || response.connected) {
      dataService.initialize(response.initialData);
      dataService.user.position = response.position;
      resolve();
    } else {
      reject(response.error);
    }
  });
});

async function createRestaurant(restaurant) {
  const response = initializeClientPromise;
  await socket.emit('createRestaurant', {restaurant});
  await response;
}

async function connectToRestaurant(restaurant) {
  const response = initializeClientPromise;
  await socket.emit('connectToRestaurant', {user: dataService.user, restaurant});
  await response;
  console.log('leave connectToRestaurant')
}

function disconnectFromRestaurant(data) {
  socket.emit('disconnectFromRestaurant', data);
  socket.once('disconnectFromRestaurant', (response) => {
    if (response.disconnected) {
      console.log('Disconnected from restaurant:', response.enrollment);
    } else {
      throw response.error;
    }
  });
}

function newDelivery(delivery) {
  socket.emit('newDelivery', {delivery});
}

module.exports = {
  register,
  authenticate,
  createBrand,
  createRestaurant,
  connectToRestaurant,
  disconnectFromRestaurant,
  newDelivery
};