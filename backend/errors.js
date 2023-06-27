

class InvalidArgumentError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidArgumentError';
  }
}

// This error doesn't extend Error because it's not meant to be caught.
// It's meant to be caught by the client and
// displayed to the user.
class UserFriendlyError {
  constructor(message, title='Error') {
    this.message = message;
    this.name = title;
  }
}

module.exports = { InvalidArgumentError, UserFriendlyError };