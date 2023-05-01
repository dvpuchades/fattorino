const bcrypt = require('bcrypt');
const User = require('./models/user');

async function createUser({email, name, password, phone}) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    email,
    name,
    phone,
    hashedPassword
  });
  await newUser.save();
  return newUser;
}

async function authenticateUser(email, password) {
  // find user by email
  const user = await User.findOne({ email });
  // if user not found, return null
  if (!user) {
    return null;
  }
  // compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.hashedPassword);
  if (!isMatch) {
    return null;
  }
  return user;
}

async function findUserById(id) {
  // return user without hashed password
  const user = await User.findById(id).select('-hashedPassword').lean();
  return user;
}

module.exports = { createUser, authenticateUser, findUserById };