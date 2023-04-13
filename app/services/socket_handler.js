import io from 'socket.io-client';
import { server } from '../environment.js';
const socket = io(server.uri);

import dataService from "./data_service";

socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
});

socket.on('initializeClient', (data) => {
  if (data.created) {
    dataService.initialize(data.initialData);
  } else {
    console.log('Error initializing client:', data.error);
  }
});

socket.on('newDelivery', (data) => {
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
        reject(new Error(response.error));
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
        reject(new Error(response.error));
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
        reject(new Error(response.error));
      }
    });
  });
  await socket.emit('createBrand', {brand});
  await response;
}

async function createRestaurant(restaurant) {
  const response = new Promise((resolve, reject) => {
    socket.once('createRestaurant', (response) => {
      if (response.created) {
        dataService.user.restaurant = response.restaurant;
        resolve();
      } else {
        reject(new Error(response.error));
      }
    });
  });
  await socket.emit('createRestaurant', {restaurant});
  await response;
}

function connectToRestaurant(data) {
  socket.emit('connectToRestaurant', data);
  socket.once('connectToRestaurant', (response) => {
    if (response.connected) {
      console.log('Connected to restaurant:', response.initialData);
    } else {
      throw new Error(response.error);
    }
  });
}

function disconnectFromRestaurant(data) {
  socket.emit('disconnectFromRestaurant', data);
  socket.once('disconnectFromRestaurant', (response) => {
    if (response.disconnected) {
      console.log('Disconnected from restaurant:', response.enrollment);
    } else {
      throw new Error(response.error);
    }
  });
}

function newDelivery(data) {
  socket.emit('newDelivery', data);
  socket.once('newDelivery', (response) => {
    if (response.created) {
      console.log('New delivery created:', response.delivery);
    } else {
      throw new Error(response.error);
    }
  });
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