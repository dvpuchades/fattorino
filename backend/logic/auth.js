const { findBrandByCreator } = require('../database/brand.js');
const { createUser, authenticateUser } = require('../database/user.js');

class Auth {
  static async register(user) {
    return await createUser(user);
  }

  static async auth(email, password) {
    const user = await authenticateUser(email, password);
    const brand = await findBrandByCreator(user._id);
    if (brand) {
      user.brand = brand._id;
    }
    return user;
  }
}

module.exports = Auth;