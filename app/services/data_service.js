
class DataServiceClass {
  constructor() {
    this.user = null;
    this.deliveries = [];
    this.trips = [];
    this.staff = [];
    this.restaurants = [];

    this.restaurantMap = new Map();

    this.deliveryFilters = new Map();
    this.staffFilters = new Map();
  }

  clean() {
    this.deliveries = [];
    this.trips = [];
    this.staff = [];
    this.restaurants = [];

    this.restaurantMap = new Map();

    this.deliveryFilters = new Map();
    this.staffFilters = new Map();
  }

  setStaff(staff) {
    this.staff = staff.map(user => {
      console.log('user from setStaff', user)
      user.restaurant = this.restaurantMap.get(user.restaurant) || user.restaurant;
      return user;
    });
    const staffMap = new Map();
    for (const s of this.staff) {
      staffMap.set(s._id, s.name);
    }
  }

  initialize(data) {
    this.restaurants = data.restaurants;

    this.restaurantMap = new Map();
    for (const r of data.restaurants) {
      this.restaurantMap.set(r._id, r.name);
    }

    console.log('restaurantMap', this.restaurantMap);

    this.staff = data.staff.map(user => {
      console.log('user', user)
      user.restaurant = this.restaurantMap.get(user.restaurant) || user.restaurant;
      return user;
    });
    const staffMap = new Map();
    for (const s of this.staff) {
      staffMap.set(s._id, s.name);
    }

    this.deliveries = data.deliveries.map(delivery => {
      delivery.restaurant = this.restaurantMap.get(delivery.restaurant);
      delivery.uploadUser = staffMap.get(delivery.uploadUser);
      delivery.cooker = staffMap.get(delivery.cooker);
      delivery.courier = staffMap.get(delivery.courier);
      return delivery;
    });
    
    this.trips = data.trips;
  }

  getStaff() {
    let filteredStaff = this.staff;
    for (let [key, fn] of this.staffFilters) {
      filteredStaff = filteredStaff.filter(fn);
    }
    return filteredStaff;
  }

  getDeliveries() {
    let filteredDeliveries = this.deliveries;
    for (let [key, fn] of this.deliveryFilters) {
      filteredDeliveries = filteredDeliveries.filter(fn);
    }
    return filteredDeliveries;
  }

  filterDelivery(delivery) {
    for (let [key, fn] of this.deliveryFilters) {
      if (!fn(delivery)) {
        console.log('delivery filtered out by', key, delivery);
        return false;
      }
    }
    return true;
  }

  addDelivery(delivery) {
    console.log('createDelivery called', delivery);
    this.deliveries.push(delivery);
  }

  updateDelivery(delivery) {
    const index = this.deliveries.findIndex(d => d._id === delivery._id);
    if (index !== -1) {
      this.deliveries[index] = delivery;
    }
    return (index !== -1);
  }

  getDeliveryCities() {
    const cities = new Set();
    for (const d of this.deliveries) {
      cities.add(d.city);
    }
    return cities;
  }

  getDeliveryPostcodes() {
    const postcodes = new Set();
    for (const d of this.deliveries) {
      postcodes.add(d.postcode);
    }
    return postcodes;
  }
  
  getDeliveryCouriers() {
    const couriers = new Set();
    for (const d of this.deliveries) {
      couriers.add(d.courier);
    }
    couriers.delete(undefined);
    return couriers;
  }

  getTrips() {
    return this.trips;
  }

  getRestaurants() {
    return this.restaurants;
  }
  
  addDeliveryFilter(key, fn) {
    this.deliveryFilters.set(key, fn);
  }

  removeDeliveryFilter(key) {
    this.deliveryFilters.delete(key);
  }

  getDeliveryFilters() {
    const filters = new Set;
    for (let [key, fn] of this.deliveryFilters) {
      filters.add(key.split('.')[0]);
    }
    return filters;
  }

  addStaffFilter(key, fn) {
    this.staffFilters.set(key, fn);
  }

  removeStaffFilter(key) {
    this.staffFilters.delete(key);
  }

  getStaffFilters() {
    const filters = new Set;
    for (let [key, fn] of this.staffFilters) {
      filters.add(key.split('.')[0]);
    }
    return filters;
  }

  getUserRestaurant() {
    for (const r of this.restaurants) {
      if (r._id === this.user.restaurant) {
        return r;
      }
    }
  }
}

const DataService = new DataServiceClass();

export default DataService;