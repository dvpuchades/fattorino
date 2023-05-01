import DataService from "./data_service";

class Brand {
  constructor(name) {
    this.name = name;
    this.creator = DataService.user._id;
  }
}

class Restaurant {
  constructor(name, address, city, postcode) {
    this.name = name;
    this.brand = DataService.user.brand;
    this.address = address;
    this.city = city;
    this.postcode = postcode;
    this.creatorId = DataService.user._id;
    this.creatorName = DataService.user.name;
  }
}

export { Brand, Restaurant };