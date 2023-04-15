const mongoose = require('mongoose');
const {connectToDatabase, closeDatabaseConnection} = require('../connection');
const { createUser, authenticateUser, findUserById } = require('../user');

describe('User module', () => {
  let db;

  beforeAll(async () => {
    // connect to a test database
    db = connectToDatabase(testing = true);
  });

  afterAll(async () => {
    // close the database connection
    await closeDatabaseConnection();
  });

  afterEach(async () => {
    // remove all documents from the users collection after each test
    await mongoose.connection.collections.users.deleteMany({});
  });

  const email = 'test@example.com';
  const name = 'Test User';
  const phone = '1234567890';
  const password = 'test123';

  describe('createUser', () => {
    it('should create a new user', async () => {
      const email = 'test@example.com';
      const name = 'Test User';
      const phone = '1234567890';
      const password = 'test123';
      const user = await createUser({email, name, password, phone});
      expect(user.email).toBe(email);
      expect(user.name).toBe(name);
      expect(user.phone).toBe(phone);
    });

    it('should throw an error if the email is not provided', async () => {
      await expect(createUser(null, 'Test User', 'test123')).rejects.toThrow();
    });

    it('should throw an error if the name is not provided', async () => {
      await expect(createUser('test@example.com", null, "test123')).rejects.toThrow();
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate a user with the correct password', async () => {
      await createUser({email, name, password, phone});
      const authenticatedUser = await authenticateUser(email, password);
      expect(authenticatedUser.email).toBe(email);
      expect(authenticatedUser.name).toBe(name);
    });

    it('should return null if the user is not found', async () => {
      await createUser({email, name, password, phone});
      const authenticatedUser = await authenticateUser('nonexistent@example.com', 'test123');
      expect(authenticatedUser).toBeNull();
    });

    it('should return null if the password is incorrect', async () => {
      await createUser({email, name, password, phone});
      const authenticatedUser = await authenticateUser(email, 'wrongpassword');
      expect(authenticatedUser).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('should find a user by id', async () => {
      const user = await createUser({email, name, password, phone});
      const foundUser = await findUserById(user._id);
      expect(foundUser.email).toBe(email);
      expect(foundUser.name).toBe(name);
      expect(foundUser.phone).toBe(phone);
    });

    it('should return null if the user is not found', async () => {
      const foundUser = await findUserById('5f7f8c3b3f0b4d3f0c4d8f2c');
      expect(foundUser).toBeNull();
    });

    it('should not return the hashed password', async () => {
      const user = await createUser({email, name, password, phone});
      const foundUser = await findUserById(user._id);
      expect(foundUser.hashedPassword).toBeUndefined();
    });
  });
    
});
