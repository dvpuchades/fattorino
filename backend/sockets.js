const server = require('http').createServer();
const io = require('socket.io')(server);
const Auth = require('./logic/auth.js');
const Delivery = require('./logic/delivery.js');
const Restaurant = require('./logic/restaurant.js');
const Staff = require('./logic/staff.js');
const Brand = require('./logic/brand.js');
const { connectToDatabase } = require('./database/connection.js');
const { InvalidArgumentError } = require('./errors.js');

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    if (socket.brand) {
      socket.leave(socket.brand);
    }
  });

  const initialize = () => {
    Delivery.init(socket.brand)
      .then((deliveries) => {
        socket.emit('init:delivery', deliveries);
      })
      .catch((error) => {
        console.log(error);
        socket.emit('init:delivery', { error });
      });
    Restaurant.init(socket.brand)
      .then((restaurants) => {
        socket.emit('init:restaurant', restaurants);
      })
      .catch((error) => {
        console.log(error);
        socket.emit('init:restaurant', { error });
      });
    Staff.init(socket.brand)
      .then((staff) => {
        socket.emit('init:staff', staff);
      })
      .catch((error) => {
        console.log(error);
        socket.emit('init:staff', { error });
      });
  };

  // socket contains brand info as below:
  // socket.brand = brand

  socket.on('register', (user) => {
    Auth.register(user)
      .then((user) => {
        socket.emit('auth', { user: user._id });
      })
      .catch((error) => {
        console.log(error);
        socket.emit('auth', { error });
      });
  });

  socket.on('auth', ({email, password}) => {
    Auth.auth(email, password)
      .then((user) => {
        socket.emit('auth', { user: user._id });
      })
      .catch((error) => {
        console.log(error);
        socket.emit('auth', { error });
      }
    );
  });

  const emitInRoom = (event, data) => {
    io.sockets.in(socket.brand).emit(event, data);
    socket.emit(event, data);
  };

  socket.on('init:delivery', () => {
    Delivery.init()
      .then((deliveries) => {
        socket.emit('init:delivery', deliveries);
      })
      .catch((error) => {
        console.log(error);
        socket.emit('init:delivery', { error });
      }
    );
  });

  socket.on('post:delivery', (delivery) => {
    Delivery.post(delivery)
      .then((newDelivery) => {
        emitInRoom('post:delivery', newDelivery);
      })
      .catch((error) => {
        console.log(error);
        socket.emit('post:delivery', { error });
      }
    );
  });

  socket.on('update:delivery', (delivery) => {
    Delivery.update(delivery)
      .then((updatedDelivery) => {
        emitInRoom('update:delivery', updatedDelivery);
        // Other entities depend on Delivery
        if (delivery.status === 'delivering') {
          Staff.get({ courierForDelivery: delivery._id })
            .then((courier) => {
              emitInRoom('update:staff', courier);
            });
        }
        else if (delivery.status === 'shipped') {
          Staff.get({ courierForDelivery: delivery._id })
            .then((courier) => {
              emitInRoom('update:staff', courier);
            });
          Restaurant.get({ deliveryId: delivery._id })
            .then((restaurant) => {
              emitInRoom('update:restaurant', restaurant);
            });
        }
      })
      .catch((error) => {
        console.log(error);
        socket.emit('update:delivery', { error });
      }
    );
  });

  socket.on('delete:delivery', (delivery) => {
    Delivery.delete(delivery)
      .then((deletedDelivery) => {
        emitInRoom('delete:delivery', deletedDelivery);
      })
      .catch((error) => {
        console.log(error);
        socket.emit('delete:delivery', { error });
      }
    );
  });

  socket.on('init:restaurant', () => {
    Restaurant.init()
      .then((restaurants) => {
        socket.emit('init:restaurant', restaurants);
      })
      .catch((error) => {
        console.log(error);
        socket.emit('init:restaurant', { error });
      }
    );
  });

  socket.on('post:restaurant', (restaurant) => {
    restaurant.brand = socket.brand;
    Restaurant.post(restaurant)
      .then((newRestaurant) => {
        Restaurant.isFirstRestaurant(socket.brand)
          .then((isFirstRestaurant) => {
            if (isFirstRestaurant) {
              Staff.post({ user: restaurant.creatorId, brand: socket.brand })
                .then((newStaff) => {
                  socket.emit('post:staff', newStaff);
                  initialize();
                })
                .catch((error) => {
                  console.log(error);
                  socket.emit('post:restaurant', { error });
                });
            }
            else {
              // emit to all sockets in the room
              // for some reason, triggering socket will catch the event
              // so using emitInRoom would duplicate the restaurant
              // in the creator client
              io.sockets.in(socket.brand).emit('post:restaurant', newRestaurant);
            }
          })
      })
      .catch((error) => {
        console.log(error);
        socket.emit('post:restaurant', { error });
      }
    );
  });

  socket.on('init:staff', () => {
    Staff.init()
      .then((staff) => {
        socket.emit('init:staff', staff);
      })
      .catch((error) => {
        console.log(error);
        socket.emit('init:staff', { error });
      }
    );
  });

  socket.on('post:staff', (staff) => {
    const joinRoomAndEmitData = (staff, broadcast) => {
      socket.brand = staff.brand.toString();
      socket.join(staff.brand.toString());
      if (broadcast) {
        emitInRoom('post:staff', staff);
        if (staff.restaurant) {
          Restaurant.get({ _id: staff.restaurant })
            .then((restaurant) => {
              emitInRoom('update:restaurant', restaurant);
            })
            .catch((error) => {
              console.log(error);
              socket.emit('post:staff', { error });
            });
        }
      }
      else {
        socket.emit('post:staff', staff);
      }
      initialize();
    };
    Staff.post(staff)
      .then((newStaff) => joinRoomAndEmitData(newStaff, true))
      .catch((error) => {
        if (error instanceof InvalidArgumentError) {
          // user was already registered
          Staff.get({
            _id: staff.user,
            restaurant: staff.restaurant,
            brand: staff.brand
          })
            .then((fetchedStaff) => joinRoomAndEmitData(fetchedStaff, false))
            .catch((error) => {
              console.log(error);
              socket.emit('post:staff', { error });
            });
        }
        console.log(error);
        socket.emit('post:staff', { error });
      }
    );
  });

  socket.on('update:staff', (staff) => {
    Staff.update(staff)
      .then((updatedStaff) => {
        emitInRoom('update:staff', updatedStaff);
      })
      .catch((error) => {
        console.log(error);
        socket.emit('update:staff', { error });
      });
  });

  socket.on('delete:staff', (staff) => {
    Staff.delete(staff)
      .then((deletedStaff) => {
        emitInRoom('delete:staff', deletedStaff);
      })
      .catch((error) => {
        console.log(error);
        socket.emit('delete:staff', { error });
      });
  });

  socket.on('post:brand', (brand) => {
    Brand.post(brand)
      .then((newBrand) => {
        socket.brand = newBrand._id.toString();
        socket.join(newBrand._id.toString());
        socket.emit('post:brand', newBrand);
      })
      .catch((error) => {
        console.log(error);
        socket.emit('post:brand', { error });
      });
  });

});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
  connectToDatabase();
});
