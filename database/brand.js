const mongoose = require('mongoose');
const brandSchema = require('./models/brand');

const Brand = mongoose.model('Brand', brandSchema);

// Create a new brand
async function createBrand(name, creator) {
  const brand = new Brand({ name, creator });
  return brand.save();
}

// Find a brand by creator
async function findBrandByCreator(creator) {
  return Brand.findOne({ creator });
}

// Find a brand by id
async function findBrandById(id) {
  return Brand.findById(id);
}

module.exports = { createBrand, findBrandByCreator, findBrandById };