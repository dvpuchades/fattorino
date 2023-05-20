const { createBrand } = require('../database/brand.js');
class Brand {

  static async post({name, creator}) {
    return await createBrand(name, creator);
  }

}

module.exports = Brand;