const server = require('http').createServer();
const io = require('socket.io')(server);
const logic = require('./logic.js');

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    if (socket.userId) {
      logic.disconnect(socket.userId);
    }
    logic.findEnrolledExMatesForUser(socket.userId,
      staff => io.sockets.in(socket.room).emit('updateStaff', { staff }),
      error => console.log(error)
    );
  });

  socket.on('register', (data) => {
    logic.register(
      data.user,
      (user) => {
        socket.emit('register', { registered: true, user});
        socket.userId = user._id;
      },
      (error) => socket.emit('register', { registered: false, error })
    );
  });

  socket.on('auth', (data) => {
    logic.auth(
      data.user,
      (user) => {
        socket.emit('auth', { authenticated: true, user })
        socket.userId = user._id;
      },
      (error) => socket.emit('auth', { authenticated: false, error })
    );
  });

  socket.on('createBrand', (data) => {
    logic.createBrand(
      data.brand,
      (brand) => socket.emit('createBrand', { created: true, brand }),
      (error) => socket.emit('createBrand', { created: false, error })
    );
  });

  socket.on('createFirstRestaurant', (data) => {
    logic.createRestaurant(
      data.restaurant,
      (restaurant) => {
        logic.initializeClient({brand: restaurant.brand},
          (initialData) => socket.emit('initializeClient', { created: true, initialData, position: 'admin' }),
          (error) => socket.emit('initializeClient', { created: false, error })
        );
        socket.join(restaurant.brand.toString());
      },
      (error) => socket.emit('initializeClient', { created: false, error })
    );
  });

  socket.on('connectToRestaurant', ({user, restaurant}) => {
    logic.connectToRestaurant(
      {user, restaurant},
      ({brand, position}) => {
        logic.initializeClient({brand: brand},
          (initialData) => {
            socket.emit('initializeClient', {
              connected: true,
              initialData,
              position,
              brand,
              restaurant
            });
            socket.join(brand.toString());
          },
          (error) => socket.emit('initializeClient', { connected: false, error })
        );
      },
    );
  });

  socket.on('disconnectFromRestaurant', (data) => {
    logic.disconnectFromRestaurant(
      data,
      (enrollment) => socket.emit('disconnectFromRestaurant',
          { disconnected: true, enrollment }),
        (error) => socket.emit('disconnectFromRestaurant', { disconnected: false, error })
    );
    logic.findEnrolledExMatesForUser(
      socket.userId,
      staff => io.sockets.in(socket.room).emit('updateStaff', { staff }),
      error => console.log(error));
    socket.leave(data.brand.toString());
  });

  const emitInRoom = (event, data) => {
    io.sockets.in(socket.room).emit(event, data);
    socket.emit(event, data);
  }

  socket.on('createRestaurant', (data) => {
    logic.createRestaurant(
      data.restaurant,
      (restaurant) => emitInRoom('createRestaurant', { created: true, restaurant }),
      (error) => socket.emit('createRestaurant', { created: false, error })
    );
  });

  socket.on('newDelivery', (data) => {
    console.log(data)
    logic.createDelivery(data.delivery,
      (delivery) => {
        emitInRoom('newDelivery', {created: true, delivery});
      },
      (error) => {
        socket.emit('newDelivery', { created: false, error })
        console.log(error)
      }
    );
  });

  socket.on('updateDelivery', (data) => {
    console.log('To update', data.delivery)
    logic.updateDelivery(data.delivery,
      (delivery) => emitInRoom('updateDelivery', { updated: true, delivery }),
      (error) => {
        socket.emit('updateDelivery', { updated: false, error });
        console.log(error)
      }
    );
  });

});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
