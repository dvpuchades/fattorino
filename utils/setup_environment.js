// Creates a default environment.js file for the backend

const fs = require('fs');
const path = require('path');

const ENVIRONMENT_FILE = path.join(__dirname, '..', 'backend', 'environment.js');

const fileContent = `
const database = {
  uri: 'mongodb://localhost:27017/fattorino-development'
}

module.exports = { database };
`;


fs.writeFileSync(ENVIRONMENT_FILE, fileContent);
console.log(`Created ${ENVIRONMENT_FILE}`);
