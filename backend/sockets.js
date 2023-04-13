const server = require('http').createServer();
const io = require('socket.io')(server);
const logic = require('./logic.js');

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('register', (data) => {
    logic.register(
      data.user,
      (user) => socket.emit('register', { registered: true, user}),
      (error) => socket.emit('register', { registered: false, error })
    );
  });

  socket.on('auth', (data) => {
    logic.auth(
      data.user,
      (user) => socket.emit('auth', { authenticated: true, user }),
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

  socket.on('createRestaurant', (data) => {
    logic.createRestaurant(
      data.restaurant,
      (restaurant) => {
        const initialData = initializeClient({restaurant: restaurant.brand});
        socket.emit('initializeClient', { created: true, initialData })
        socket.join(restaurant._id);
      },
      (error) => socket.emit('createRestaurant', { created: false, error })
    );
  });

  socket.on('connectToRestaurant', (data) => {
    logic.connectToRestaurant(
      () => {
        const initialData = initializeClient({restaurant: data.brand});
        socket.emit('initializeClient', { connected: true, initialData });
      },
      (error) => socket.emit('connectToRestaurant', { connected: false, error })
    );
  });

  socket.on('disconnectFromRestaurant', () => {
    logic.disconnectFromRestaurant(
      data,
      (enrollment) => socket.emit('disconnectFromRestaurant',
          { disconnected: true, enrollment }),
        (error) => socket.emit('disconnectFromRestaurant', { disconnected: false, error })
      );
  });

  socket.on('newDelivery', (data) => {
    logic.createDelivery(data.delivery,
      (delivery) => {
        const rooms = Object.keys(socket.rooms);
        rooms.forEach((room) => {
          io.to(room).emit('newDelivery', { created: true, delivery });
        });
      },
      (error) => socket.emit('newDelivery', { created: false, error })
    );
  });

  socket.on('updateDelivery', (data) => {
    logic.updateDelivery(data.delivery,
      (delivery) => {
        const rooms = Object.keys(socket.rooms);
        rooms.forEach((room) => {
          io.to(room).emit('updateDelivery', { updated: true, delivery });
        });
      },
      (error) => socket.emit('updateDelivery', { updated: false, error })
    );
  });

});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
