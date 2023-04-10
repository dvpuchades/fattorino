const io = require('socket.io-client');
const { server } = require('../environment.js');
const socket = io(server.uri);

const { dataService } = require('./data_service');

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

function register(data) {
  socket.emit('register', data);
  socket.once('register', (response) => {
    if (response.registered) {
      console.log('User registered:', response.user);
      dataService.user = response.user;
    } else {
      throw new Error(response.error);
    }
  });
}

async function authenticate({email, password}) {
  // const response = new Promise((resolve, reject) => {
  //   socket.once('auth', (response) => {
  //     if (response.authenticated) {
  //       console.log('User authenticated:', response.user);
  //       resolve();
  //     } else {
  //       reject(new Error(response.error));
  //     }
  //   });
  // });
  console.log('Enters authenticate')
  const user = { email, password };
  await socket.emit('auth', user);
  // await response;
}


function createBrand(data) {
  socket.emit('createBrand', data);
  socket.once('createBrand', (response) => {
    if (response.created) {
      console.log('Brand created:', response.brand);
    } else {
      throw new Error(response.error);
    }
  });
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
  connectToRestaurant,
  disconnectFromRestaurant,
  newDelivery
};