const { findUserById } = require('../../database/user.js');
const { findRestaurantById } = require('../../database/restaurant.js');
const {
  createEnrollment,
  findLastEnrollmentByUserAndRestaurant
} = require('../../database/enrollment.js');
const { findTodaysDeliveriesForCourier } = require('../../database/delivery.js');
const { findBrandById } = require('../../database/brand.js');

jest.mock('../../database/user.js');
jest.mock('../../database/restaurant.js');
jest.mock('../../database/enrollment.js');
jest.mock('../../database/delivery.js');
jest.mock('../../database/brand.js');

const mongoose = require('mongoose');
const Staff = require('../staff.js');

const restaurantId = new mongoose.Types.ObjectId();
const brandId = new mongoose.Types.ObjectId();
const userId = new mongoose.Types.ObjectId();
const enrollmentId = new mongoose.Types.ObjectId();
const creatorId = new mongoose.Types.ObjectId();

describe('testing post:staff logic', () => {
  beforeEach(() => {
    // Mock the common functions and their return values
    const restaurant = {
      _id: restaurantId,
      name: 'restaurant',
      brand: brandId,
      creatorId: creatorId
    };
    const user = {
      _id: userId,
      email: 'user@test.com',
      name: 'user',
      phone: '123456789',
      status: 'idle'
    };
    const brand = {
      _id: brandId,
      name: 'brand',
      creator: creatorId
    };
    
    findRestaurantById.mockResolvedValue(restaurant);
    findTodaysDeliveriesForCourier.mockResolvedValue([]);
    findUserById.mockResolvedValue(user);
    findBrandById.mockResolvedValue(brand);
    createEnrollment.mockImplementation((enrollment) => {
      enrollment._id = enrollmentId;
      return enrollment;
    });
  });

  it('should enroll a user providing brand without a previous enrollment (new brand scenario)', async () => {
    // Mock specific functions to this test
    const user = {
      _id: creatorId,
      email: 'user@test.com',
      name: 'user',
      phone: '123456789',
      status: 'idle'
    };
    findUserById.mockResolvedValue(user);
    findLastEnrollmentByUserAndRestaurant.mockResolvedValue(null);

    // Call the function to test
    const input = {
      user: creatorId.toString(),
      brand: brandId.toString()
    };
    const result = await Staff.post(input);

    // Check the result
    const returnedUser = {
      _id: creatorId,
      email: 'user@test.com',
      name: 'user',
      phone: '123456789',
      status: 'idle',
      position: 'admin',
      restaurant: undefined
    };
    expect(result._id).toBe(returnedUser._id);
    expect(result.email).toBe(returnedUser.email);
    expect(result.name).toBe(returnedUser.name);
    expect(result.phone).toBe(returnedUser.phone);
    expect(result.status).toBe(returnedUser.status);
    expect(result.position).toBe(returnedUser.position);
    expect(result.restaurant).toBe(returnedUser.restaurant);
  });

  it('should enroll a user given a restaurant without a previous enrollment (log in first time)', async () => {
    // Mock specific functions to this test
    findLastEnrollmentByUserAndRestaurant.mockResolvedValue(null);

    // Call the function to test
    const input = {
      user: userId.toString(),
      restaurant: restaurantId.toString()
    };
    const result = await Staff.post(input);

    // Check the result
    const returnedUser = {
      _id: userId,
      email: 'user@test.com',
      name: 'user',
      phone: '123456789',
      status: 'idle',
      position: 'staff',
      restaurant: 'restaurant'
    };
    expect(result._id).toBe(returnedUser._id);
    expect(result.email).toBe(returnedUser.email);
    expect(result.name).toBe(returnedUser.name);
    expect(result.phone).toBe(returnedUser.phone);
    expect(result.status).toBe(returnedUser.status);
    expect(result.position).toBe(returnedUser.position);
    expect(result.restaurant).toBe(returnedUser.restaurant);
  });

  it('should enroll a user given a restaurant having a opened enrollment', async () => {
    // Mock specific functions to this test
    const createdEnrollment = {
      _id: enrollmentId,
      user: userId,
      restaurant: restaurantId,
      position: 'staff',
      brand: brandId,
      initTime: new Date()
    };
    const enrollment = {
      _id: enrollmentId,
      user: userId,
      brand: brandId,
      restaurant: restaurantId,
      position: 'staff',
      initTime: new Date()
    };

    createEnrollment.mockResolvedValue(createdEnrollment);
    findLastEnrollmentByUserAndRestaurant.mockResolvedValue(enrollment);

    // get current number of calls to createEnrollment
    const createEnrollmentNumberOfCalls = createEnrollment.mock.calls.length;

    // Call the function to test
    const input = {
      user: userId.toString(),
      restaurant: restaurantId.toString()
    };
    const result = await Staff.post(input);

    // Check the result
    const returnedUser = {
      _id: userId,
      email: 'user@test.com',
      name: 'user',
      phone: '123456789',
      status: 'idle',
      position: 'staff',
      restaurant: 'restaurant'
    };
    expect(result._id).toBe(returnedUser._id);
    expect(result.email).toBe(returnedUser.email);
    expect(result.name).toBe(returnedUser.name);
    expect(result.phone).toBe(returnedUser.phone);
    expect(result.status).toBe(returnedUser.status);
    expect(result.position).toBe(returnedUser.position);
    expect(result.restaurant).toBe(returnedUser.restaurant);

    // as an opened enrollment was found, the createEnrollment function should not be called
    expect(createEnrollment.mock.calls).toHaveLength(createEnrollmentNumberOfCalls);
  });

  it('should enroll a user given a restaurant having a previous closed enrollment (common scenario)', async () => {
    // Mock specific functions to this test
    const createdEnrollment = {
      _id: enrollmentId,
      user: userId,
      restaurant: restaurantId,
      position: 'staff',
      brand: brandId,
      initTime: new Date()
    };
    const enrollment = {
      _id: enrollmentId,
      user: userId,
      brand: brandId,
      restaurant: restaurantId,
      position: 'staff',
      initTime: new Date(),
      endTime: new Date()
    };

    createEnrollment.mockResolvedValue(createdEnrollment);
    findLastEnrollmentByUserAndRestaurant.mockResolvedValue(enrollment);

    // Call the function to test
    const input = {
      user: userId.toString(),
      restaurant: restaurantId.toString()
    };
    const result = await Staff.post(input);

    // Check the result
    const returnedUser = {
      _id: userId,
      email: 'user@test.com',
      name: 'user',
      phone: '123456789',
      status: 'idle',
      position: 'staff',
      restaurant: 'restaurant'
    };
    expect(result._id).toBe(returnedUser._id);
    expect(result.email).toBe(returnedUser.email);
    expect(result.name).toBe(returnedUser.name);
    expect(result.phone).toBe(returnedUser.phone);
    expect(result.status).toBe(returnedUser.status);
    expect(result.position).toBe(returnedUser.position);
    expect(result.restaurant).toBe(returnedUser.restaurant);
  });

});
