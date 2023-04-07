const mongoose = require('mongoose');
const {connectToDatabase, closeDatabaseConnection} = require('../connection');
const { createUser, authenticateUser } = require('../user');

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

  describe('createUser', () => {
    it('should create a new user', async () => {
      const email = 'test@example.com';
      const name = 'Test User';
      const password = 'test123';
      const user = await createUser(email, name, password);
      expect(user.email).toBe(email);
      expect(user.name).toBe(name);
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
      const email = 'test@example.com';
      const name = 'Test User';
      const password = 'test123';
      await createUser(email, name, password);
      const authenticatedUser = await authenticateUser(email, password);
      expect(authenticatedUser.email).toBe(email);
      expect(authenticatedUser.name).toBe(name);
    });

    it('should return null if the user is not found', async () => {
      const authenticatedUser = await authenticateUser('nonexistent@example.com', 'test123');
      expect(authenticatedUser).toBeNull();
    });

    it('should return null if the password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'test123';
      await createUser(email, 'Test User', password);
      const authenticatedUser = await authenticateUser(email, 'wrongpassword');
      expect(authenticatedUser).toBeNull();
    });
  });
});
