const { connectToDatabase, closeDatabaseConnection } = require('../connection');
const { createBrand, findBrandByCreator, findBrandById } = require('../brand');
const { createUser } = require('../user');
const { default: mongoose } = require('mongoose');

let db;

beforeAll(async () => {
  db = await connectToDatabase(testing = true);
});

afterAll(async () => {
  await closeDatabaseConnection();
});

describe('Brand functions', () => {
  describe('createBrand', () => {
    it('should create a new brand', async () => {
      const testUser = await createUser(
        {
          email: 'newbrand@test.com',
          name: 'testUser',
          password: 'testPassword',
          phone: '1234567890'
        });
      const brand = await createBrand('Test New Brand', testUser._id);
      expect(brand.name).toEqual('Test New Brand');
      expect(brand.creator).toEqual(testUser._id);
      expect(brand._id).toBeDefined();
    });
  });

  describe('findBrandByCreator', () => {
    it('should find a brand by creator', async () => {
      const testUser = await createUser(
        {
          email: 'creatorbrand@test.com', 
          name: 'testUser', 
          password: 'testPassword',
          phone: '1234567890'
        });
      const brand = await createBrand('Test Brand By Creator', testUser._id);
      const foundBrand = await findBrandByCreator(testUser._id);
      expect(foundBrand._id).toEqual(brand._id);
    });

    it('should return null if brand not found', async () => {
      const testUser = await createUser({
        email: 'nobrand@test.com',
        name: 'testUser',
        password: 'testPassword',
        phone: '1234567890'
      });
      const foundBrand = await findBrandByCreator(testUser._id);
      expect(foundBrand).toBeNull();
    });
  });

  describe('findBrandById', () => {
    it('should find a brand by id', async () => {
      const testUser = await createUser({
        email: 'idbrand@test.com',
        name: 'testUser',
        password: 'testPassword',
        phone: '1234567890'
      });
      const brand = await createBrand('Test id Brand', testUser._id);
      const foundBrand = await findBrandById(brand._id);
      expect(foundBrand.name).toEqual('Test id Brand');
      expect(foundBrand.creator).toEqual(testUser._id);
    });

    it('should return null if brand not found', async () => {
      const ObjectId = mongoose.Types.ObjectId;
      const foundBrand = await findBrandById(new ObjectId());
      expect(foundBrand).toBeNull();
    });
  });
});