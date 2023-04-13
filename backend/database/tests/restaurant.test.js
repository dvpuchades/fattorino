const mongoose = require('mongoose');
const { connectToDatabase, closeDatabaseConnection } = require('../connection.js');
const {
  createRestaurant,
  findRestaurantsByBrandId,
  deleteRestaurant,
} = require('../restaurant.js');

const testBrandId = new mongoose.Types.ObjectId();
let testRestaurantId;
const testUserId = new mongoose.Types.ObjectId();
const date = new Date();

beforeAll(async () => {
  // Connect to test database
  await connectToDatabase(testing = true);
});

afterAll(async () => {
  // Disconnect from test database
  await closeDatabaseConnection();
});

describe('Restaurant service', () => {
  describe('createRestaurant', () => {
    it('should create a new restaurant', async () => {
      const restaurantData = {
        brand: testBrandId,
        name: 'New Test Restaurant',
        address: '456 Main St',
        city: 'Anytown',
        postcode: '12345',
        creator: testUserId
      };
      const createdRestaurant = await createRestaurant(restaurantData);
      testRestaurantId = createdRestaurant._id;

      expect(createdRestaurant.brand).toEqual(testBrandId);
      expect(createdRestaurant.name).toEqual('New Test Restaurant');
      expect(createdRestaurant.address).toEqual('456 Main St');
      expect(createdRestaurant.city).toEqual('Anytown');
      expect(createdRestaurant.postcode).toEqual('12345');
      expect(createdRestaurant.creator).toEqual(testUserId);
      expect(createdRestaurant.created).toBeInstanceOf(Date);
    });
  });

  describe('findRestaurantsByBrandId', () => {
    it('should return all restaurants with the specified brand ID', async () => {
      const restaurants = await findRestaurantsByBrandId(testBrandId);

      expect(restaurants).toHaveLength(1); // Including the test restaurant created in beforeAll
      expect(restaurants[0].brand).toEqual(testBrandId);
    });
  });

  describe('deleteRestaurant', () => {
    it('should delete a restaurant', async () => {
      await deleteRestaurant(testRestaurantId);
      const deletedRestaurant = await findRestaurantsByBrandId(testBrandId);
      expect(deletedRestaurant).toHaveLength(0);
    });
  });
});
