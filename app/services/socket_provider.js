import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { server } from '../environment.js';
import DataService from './data_service.js';

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const socket = io(server.uri);

  const getDeliveries = () => {
    return DataService.getDeliveries();
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    return () => {
      socket.off('connect');
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
          DataService.user = response.user;
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
          DataService.user = response.user;
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
          DataService.user.brand = response.brand;
          resolve();
        } else {
          reject(response.error);
        }
      });
    });
    await socket.emit('createBrand', {brand});
    await response;
  }

  const initializeClient = async () => {
    const incomingData = new Promise((resolve, reject) => {
      socket.once('initializeClient', (response) => {
        if (response.created || response.connected) {
          DataService.initialize(response.initialData);
          DataService.user.position = response.position;
          DataService.user.restaurant = response.restaurant;
          DataService.user.brand = response.brand;
          resolve();
        } else {
          reject(response.error);
        }
      });
    });
    await incomingData;
  }

  const createFirstRestaurant = async (restaurant) => {
    await socket.emit('createFirstRestaurant', {restaurant});
    await initializeClientPromise();
  }

  const createRestaurant = async (restaurant) => {
    await socket.emit('createRestaurant', {restaurant});
  }

  const connectToRestaurant = async (restaurant) => {
    await socket.emit('connectToRestaurant', {user: DataService.user, restaurant});
    await initializeClientPromise();
  }

  const disconnectFromRestaurant = async () => {
    socket.emit('disconnectFromRestaurant', {
      user: DataService.user._id,
      brand: DataService.user.brand
    });
  };

  const createDelivery = async (delivery) => {
    socket.emit('newDelivery', {delivery});
  }

  const useSocketEvent = (eventName, handler) => {
    const { socket } = useContext(SocketContext);
  
    useEffect(() => {
      if (socket.hasListeners(eventName)) {
        console.log('Socket already has listener for event:', eventName);
        return;
      }
      socket.on(eventName, handler);
      // Clean up the event listener when the component unmounts
      return () => {
        socket.off(eventName, handler);
      };
    }, [eventName, handler, socket]);
  };

  return (
    <SocketContext.Provider value={{
      socket,
      register,
      authenticate,
      createBrand,
      createFirstRestaurant,
      createRestaurant,
      connectToRestaurant,
      disconnectFromRestaurant,
      createDelivery,
      getDeliveries,
      useSocketEvent
    }}>
      {children}
    </SocketContext.Provider>
  );
};


export { SocketContext, SocketProvider };
