const mongoose = require('mongoose');
const { connectToDatabase, closeDatabaseConnection } = require('../connection');

describe('Database connection', () => {
  it('should connect to the database', async () => {
    const connection = await connectToDatabase();
    expect(connection.readyState).toBe(1);
  });

  it('should disconnect from the database', async () => {
    await closeDatabaseConnection();
    expect(mongoose.connection.readyState).toBe(0);
  });
});