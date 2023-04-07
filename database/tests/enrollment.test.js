const mongoose = require('mongoose');
const { connectToDatabase, closeDatabaseConnection } = require('../connection.js');
const {
  createEnrollment,
  findLastEnrollmentByUserAndRestaurant,
  updateLastEnrollment
} = require('../enrollment.js');

const userId = new mongoose.Types.ObjectId();
const restaurantId = new mongoose.Types.ObjectId();

describe('Enrollment controller', () => {
  let testEnrollmentId;

  beforeAll(async () => {
    await connectToDatabase(testing = true);
  });

  afterAll(async () => {
    // Disconnect from test database
    await closeDatabaseConnection();
  });

  describe('createEnrollment function', () => {
    test('should create a new enrollment', async () => {
      const enrollment = await createEnrollment({
        user: userId,
        restaurant: restaurantId,
        position: 'admin',
        initTime: new Date()
      });
      expect(enrollment).toMatchObject({
        user: userId,
        restaurant: restaurantId,
        position: 'admin'
      });
      testEnrollmentId = enrollment._id;
    });
  });

  describe('findLastEnrollmentByUserAndRestaurant function', () => {
    test('should find an enrollment by user and restaurant', async () => {
      const enrollment = await findLastEnrollmentByUserAndRestaurant(userId, restaurantId);
      expect(enrollment).toMatchObject({
        user: userId,
        restaurant: restaurantId,
        position: 'admin'
      });
    });
  });

  describe('updateLastEnrollment function', () => {
    test('should update an enrollment', async () => {
      const update = {
        position: 'manager',
        endTime: new Date()
      };
      const enrollment = await updateLastEnrollment(userId, restaurantId, update);
      expect(enrollment).toMatchObject({
        user: userId,
        restaurant: restaurantId,
        position: 'manager',
        endTime: update.endTime
      });
    });
  });
});
