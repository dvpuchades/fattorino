// List of handled errors in backend:

class InvalidArgumentError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidArgumentError';
  }
}

module.exports = { InvalidArgumentError };