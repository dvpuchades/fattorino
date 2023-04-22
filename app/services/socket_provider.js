import React, { createContext, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import { server } from '../environment.js';

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const socket = io(server.uri);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });
    return () => {
      socket.off('connect');
    };
  }, [socket]);

  useEffect(() => {
    socket.on('newDelivery', (data) => {
      console.log('New delivery:', data);
      if (data.created) {
        // TODO: handle new delivery
      } else {
        console.log('Error creating delivery:', data.error);
      }
    });
    socket.on('updateDelivery', (data) => {
      if (data.updated) {
        // TODO: handle updated delivery
      } else {
        console.log('Error updating delivery:', data.error);
      }
    });
    return () => {
      socket.off('newDelivery');
      socket.off('updateDelivery');
    };
  }, [socket]);

  useEffect(() => {
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
    return () => {
      socket.off('disconnect');
    };
  }, [socket]);

  const register = async (user) => {
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

  const authenticate = async ({email, password}) => {
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

  const createBrand = async (brand) => {
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

  const createRestaurant = async (restaurant) => {
    const response = initializeClientPromise;
    await socket.emit('createRestaurant', {restaurant});
    await response;
  }

  const connectToRestaurant = async (restaurant) => {
    const response = initializeClientPromise;
    await socket.emit('connectToRestaurant', {user: dataService.user, restaurant});
    await response;
    console.log('leave connectToRestaurant')
  }

  const createDelivery = async (delivery) => {
    socket.emit('newDelivery', {delivery});
  }

  return (
    <SocketContext.Provider value={{
      register,
      authenticate,
      createBrand,
      createRestaurant,
      connectToRestaurant,
      createDelivery
    }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return socket;
};

export { SocketProvider, useSocket };
