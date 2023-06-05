const mongoose = require('mongoose');
const { createDelivery, findRecentOrActiveDeliveries, updateDelivery, findDeliveryById, deleteDelivery } = require('../delivery');
const Delivery = require('../models/delivery');
const { connectToDatabase, closeDatabaseConnection } = require('../connection');

// Create a test delivery object
const testDelivery = {
  customerName: 'John Doe',
  customerPhone: '555-1234',
  address: '123 Main St',
  city: 'Anytown',
  postcode: '12345',
  amount: 10.99,
  status: 'pending',
  initTime: new Date(),
  uploadUser: new mongoose.Types.ObjectId(),
  restaurant: new mongoose.Types.ObjectId(),
  brand: new mongoose.Types.ObjectId()
};

let db;

beforeAll(async () => {
  db = await connectToDatabase(testing = true);
});

afterAll(async () => {
  await closeDatabaseConnection();
});

describe('createDelivery', () => {
  it('should create a new delivery', async () => {
    const result = await createDelivery(testDelivery);
    expect(result.customerName).toBe(testDelivery.customerName);
    expect(result.customerPhone).toBe(testDelivery.customerPhone);
    expect(result.address).toBe(testDelivery.address);
    expect(result.city).toBe(testDelivery.city);
    expect(result.postcode).toBe(testDelivery.postcode);
    expect(result.amount).toBe(testDelivery.amount);
    expect(result.status).toBe(testDelivery.status);
    expect(result.initTime).toEqual(testDelivery.initTime);
    expect(result.uploadUser).toEqual(testDelivery.uploadUser);
    expect(result).toHaveProperty('_id');
  });
});

describe('findRecentOrActiveDeliveries', () => {
  it('should find recent or active deliveries', async () => {
    const result = await findRecentOrActiveDeliveries(testDelivery.restaurant);
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('updateDelivery', () => {
  let deliveryId;

  beforeAll(async () => {
    const newDelivery = await createDelivery(testDelivery);
    deliveryId = newDelivery._id;
  });

  it('should update a delivery in every field where possible', async () => {
    const updatedDelivery = {
      _id: deliveryId,
      status: 'shipped',
      departureTime: new Date(),
      courier: new mongoose.Types.ObjectId(),
      readyTime: new Date(),
      endTime: new Date(),
      cooker: new mongoose.Types.ObjectId()
    };
    const result = await updateDelivery(updatedDelivery);
    expect(result.status).toBe(updatedDelivery.status);
    expect(result.departureTime).toEqual(updatedDelivery.departureTime);
    expect(result.courier).toEqual(updatedDelivery.courier);
    expect(result.readyTime).toEqual(updatedDelivery.readyTime);
    expect(result.endTime).toEqual(updatedDelivery.endTime);
    expect(result.cooker).toEqual(updatedDelivery.cooker);
  });

  it('should update some fields of a delivery and remain others the same', async () => {
    const updatedDelivery = {
      _id: deliveryId,
      status: 'shipped',
      departureTime: new Date()
    };
    await updateDelivery(updatedDelivery);
    const result = await findDeliveryById(deliveryId);
    expect(result.status).toBe(updatedDelivery.status);
    expect(result.departureTime).toEqual(updatedDelivery.departureTime);
    expect(testDelivery.courier).toEqual(updatedDelivery.courier);
  });

  it('should throw an error for non-existent delivery', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const fakeDelivery = {
      _id: fakeId,
      status: 'shipped',
      departureTime: new Date()
    };
    await expect(updateDelivery(fakeDelivery)).rejects.toThrow('Delivery not found');
  });
});

describe('deleteDelivery', () => {
  let deliveryId;

  beforeAll(async () => {
    const newDelivery = await createDelivery(testDelivery);
    deliveryId = newDelivery._id;
  });

  it('should delete a delivery', async () => {
    const result = await deleteDelivery(deliveryId);
    expect(result).toHaveProperty('_id', deliveryId);
    const checkResult = await findDeliveryById(deliveryId);
    expect(checkResult).toBeNull();
  });

  it('should return null for non-existent delivery', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const result = await deleteDelivery(fakeId);
    expect(result).toBeNull();
  });
});
