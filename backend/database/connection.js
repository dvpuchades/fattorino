const mongoose = require('mongoose');

const DB_URI = "mongodb://localhost:27017/fattorino-development"
const TESTING_DB_URI = "mongodb://localhost:27017/fattorino-testing"

async function connectToDatabase(testing = false) {
  let mongoUri = DB_URI;
  if (testing) {
    mongoUri = TESTING_DB_URI;
    resetDatabase(TESTING_DB_URI);
  }
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to database');
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1); // exit the process if the connection fails
  }
  return mongoose.connection;
}

async function resetDatabase(uri) {
  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();
  console.log('Database reset');
}


async function closeDatabaseConnection() {
  await mongoose.disconnect();
  console.log('Disconnected from database');
}

module.exports = { connectToDatabase, closeDatabaseConnection };