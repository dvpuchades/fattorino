import dataService from "./data_service";

class Brand {
  constructor(name) {
    this.name = name;
    this.creator = dataService.user._id;
  }
}

class Restaurant {
  constructor(name, address, city, postcode) {
    this.name = name;
    this.brand = dataService.user.brand._id;
    this.address = address;
    this.city = city;
    this.postcode = postcode;
    this.creator = dataService.user._id;
  }
}

export { Brand, Restaurant };