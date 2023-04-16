
class DataService {
  constructor() {
    this.user = null;
    this.deliveries = [];
    this.trips = [];
    this.staff = [];
    this.restaurants = [];

    this.deliveryFilters = new Map();
    this.staffFilters = new Map();
  }

  initialize(data) {
    this.restaurants = data.restaurants;
    const restaurantMap = new Map();
    for (const r of this.restaurants) {
      restaurantMap.set(r._id, r.name);
    }
    this.deliveries = data.deliveries;
    this.trips = data.trips;
    this.staff = data.staff.map(user => {
      user.restaurant = restaurantMap.get(user.restaurant);
      return user;
    });
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

  createDelivery(delivery) {
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

  fillWithTestData() {
    this.staff = [
      {
        id: "1",
        name: "Albert Einstein",
        status: "delivering",
        restaurant: "Genis Pizza",
        phone: "+39 1234567890",
        numberOfDeliveries: 2,
        balance: 34.55,
        currentTrip: {
          initTime: "12:17",
          deliveries: [
            {
              id: "1",
              address: "Carrer de la Lluna, 5",
              city: "Barcelona",
              postcode: "08001",
              initTime: "12:00",
              endTime: "12:24",
              status: "shipped",
              restaurant: "Genis Pizza",
              courier: "Albert Einstein",
              uploadUser: "Nikola Tesla",
              customerName: "Zaphod Beeblebrox",
              customerPhone: "+39 1234567890",
              amount: 12.35
            },
            {
              id: "3",
              address: "Carrer del Sol, 12",
              city: "Barcelona",
              postcode: "08001",
              initTime: "12:17",
              endTime: undefined,
              status: "delivering",
              restaurant: "Genis Pizza",
              courier: "Albert Einstein",
              uploadUser: "Nikola Tesla",
              customerName: "Pablo Picasso",
              customerPhone: "+39 1234567890",
              amount: 10.00
            }
          ]
        }
      },
      {
        id: "2",
        name: "Enzo Ferrari",
        status: "delivering",
        restaurant: "Genis Pizza",
        phone: "+39 1234567890",
        numberOfDeliveries: 1,
        balance: 24.90,
        currentTrip: {
          initTime: "12:12",
          deliveries: [ 
            {
              id: "2",
              address: "Carrer de les Flors, 45",
              city: "Barcelona",
              postcode: "08001",
              initTime: "12:12",
              endTime: undefined,
              status: "delivering",
              restaurant: "Genis Pizza",
              courier: "Enzo Ferrari",
              uploadUser: "Nikola Tesla",
              customerName: "Oscar Wilde",
              customerPhone: "+39 1234567890",
              amount: 15.65
            }
          ]
        }
      },
      {
        id: "3",
        name: "Alan Turing",
        status: "idle",
        restaurant: "Ilustres Pizza",
        phone: "+39 1234567890",
        numberOfDeliveries: 0,
        balance: 0,
        currentTrip: undefined
      },
      {
        id: "4",
        name: "Nikola Tesla",
        status: "idle",
        restaurant: "Genis Pizza",
        phone: "+39 1234567890",
        numberOfDeliveries: 0,
        balance: 0,
        currentTrip: undefined
      },
      {
        id: "5",
        name: "Pablo Neruda",
        status: "idle",
        restaurant: "Llibres Pizza",
        phone: "+39 1234567890",
        numberOfDeliveries: 0,
        balance: 0,
        currentTrip: undefined
      },
      {
        id: "6",
        name: "Ruby Sparks",
        status: "delivering",
        restaurant: "Llibres Pizza",
        phone: "+39 1234567890",
        numberOfDeliveries: 2,
        balance: 35.65,
        currentTrip: {
          initTime: "12:17",
          deliveries: [
            {
              id: "7",
              address: "Carrer de Carchofes, 78",
              city: "Barcelona",
              postcode: "08001",
              initTime: "12:11",
              readyBy: "Pablo Neruda",
              readyTime: "12:20",
              endTime: undefined,
              status: "delivering",
              restaurant: "Llibres Pizza",
              courier: "Ruby Sparks",
              uploadUser: "Pablo Neruda",
              customerName: "Esther Williams",
              customerPhone: "+39 1234567890",
              amount: 15.65
            },
            {
              id: "8",
              address: "Carrer del Sol, 12",
              city: "Barcelona",
              postcode: "08001",
              initTime: "12:17",
              readyBy: "Pablo Neruda",
              readyTime: "12:22",
              endTime: undefined,
              status: "delivering",
              restaurant: "Llibres Pizza",
              courier: "Ruby Sparks",
              uploadUser: "William Shakespeare",
              customerName: "Wallace Stevens",
              customerPhone: "+39 1234567890",
              amount: 10.00
            }
          ]
        }
      }
  ];

    this.deliveries = [{
      id: "1",
      address: "Carrer de la Lluna, 5",
      city: "Barcelona",
      postcode: "08001",
      initTime: "12:00",
      readyTime: "12:05",
      readyBy: "Alan Turing",
      departureTime: "12:10",
      endTime: "12:24",
      status: "shipped",
      restaurant: "Genis Pizza",
      courier: "Albert Einstein",
      uploadUser: "Nikola Tesla",
      customerName: "Zaphod Beeblebrox",
      customerPhone: "+39 1234567890",
      amount: 12.35
    },
    {
      id: "2",
      address: "Carrer de les Flors, 45",
      city: "Barcelona",
      postcode: "08001",
      initTime: "12:12",
      readyBy: "Nikola Tesla",
      readyTime: "12:20",
      endTime: undefined,
      status: "delivering",
      restaurant: "Genis Pizza",
      courier: "Enzo Ferrari",
      uploadUser: "Nikola Tesla",
      customerName: "Oscar Wilde",
      customerPhone: "+39 1234567890",
      amount: 15.65
    },
    {
      id: "3",
      address: "Carrer del Sol, 12",
      city: "Barcelona",
      postcode: "08001",
      initTime: "12:17",
      readyBy: "Nikola Tesla",
      readyTime: "12:22",
      endTime: undefined,
      status: "delivering",
      restaurant: "Genis Pizza",
      courier: "Albert Einstein",
      uploadUser: "Nikola Tesla",
      customerName: "Pablo Picasso",
      customerPhone: "+39 1234567890",
      amount: 10.00
    },
    {
      id: "4",
      address: "Carrer de la Tardor, 1",
      city: "Barcelona",
      postcode: "08001",
      initTime: "12:17",
      endTime: undefined,
      status: "preparing",
      restaurant: "Ilustres Pizza",
      courier: undefined,
      uploadUser: "Alan Turing",
      customerName: "Rita Levi-Montalcini",
      customerPhone: "+39 1234567890",
      amount: 8.00
    },
    {
      id: "5",
      address: "Carrer de la Primavera, 1",
      city: "Barcelona",
      postcode: "08001",
      initTime: "12:17",
      readyBy: "Nikola Tesla",
      readyTime: "12:22",
      endTime: undefined,
      status: "ready",
      restaurant: "Ilustres Pizza",
      courier: undefined,
      uploadUser: "Alan Turing",
      customerName: "Ada Lovelace",
      customerPhone: "+39 1234567890",
      amount: 25.75
    },
    {
      id: "6",
      address: "Carrer de la Lluna, 5",
      city: "Barcelona",
      postcode: "08001",
      initTime: "12:00",
      readyTime: "12:05",
      readyBy: "Alan Turing",
      departureTime: "12:10",
      endTime: "12:24",
      status: "shipped",
      restaurant: "Genis Pizza",
      courier: "Albert Einstein",
      uploadUser: "Nikola Tesla",
      customerName: "Zaphod Beeblebrox",
      customerPhone: "+39 1234567890",
      amount: 12.35
    },
    {
      id: "7",
      address: "Carrer de Carchofes, 78",
      city: "Barcelona",
      postcode: "08001",
      initTime: "12:11",
      readyBy: "Pablo Neruda",
      readyTime: "12:20",
      endTime: undefined,
      status: "delivering",
      restaurant: "Llibres Pizza",
      courier: "Ruby Sparks",
      uploadUser: "Pablo Neruda",
      customerName: "Esther Williams",
      customerPhone: "+39 1234567890",
      amount: 15.65
    },
    {
      id: "8",
      address: "Carrer del Sol, 12",
      city: "Barcelona",
      postcode: "08001",
      initTime: "12:17",
      readyBy: "Pablo Neruda",
      readyTime: "12:22",
      endTime: undefined,
      status: "delivering",
      restaurant: "Llibres Pizza",
      courier: "Ruby Sparks",
      uploadUser: "William Shakespeare",
      customerName: "Wallace Stevens",
      customerPhone: "+39 1234567890",
      amount: 10.00
    },
    {
      id: "9",
      address: "Carrer de la Tardor, 34",
      city: "Barcelona",
      postcode: "08001",
      initTime: "12:21",
      endTime: undefined,
      status: "preparing",
      restaurant: "Llibres Pizza",
      courier: undefined,
      uploadUser: "William Shakespeare",
      customerName: "Yoko Ono",
      customerPhone: "+39 1234567890",
      amount: 8.00
    },
    {
      id: "10",
      address: "Avinguda de la Primavera, 45",
      city: "Barcelona",
      postcode: "08001",
      initTime: "12:17",
      readyBy: "Pablo Neruda",
      readyTime: "12:23",
      endTime: undefined,
      status: "ready",
      restaurant: "Llibres Pizza",
      courier: undefined,
      uploadUser: "William Shakespeare",
      customerName: "Pol Pot",
      customerPhone: "+39 1234567890",
      amount: 25.75
    },
    {
      id: "11",
      address: "Carrer de la Lluna, 5",
      city: "Barcelona",
      postcode: "08001",
      initTime: "12:00",
      readyTime: "12:05",
      readyBy: "Alan Turing",
      departureTime: "12:10",
      endTime: "12:24",
      status: "shipped",
      restaurant: "Genis Pizza",
      courier: "Albert Einstein",
      uploadUser: "Nikola Tesla",
      customerName: "Zaphod Beeblebrox",
      customerPhone: "+39 1234567890",
      amount: 12.35
    }
  ];

    this.trips = [
      {
        id: "1",
        initTime: "12:20",
        deliveries: [
          {
            id: "4",
            address: "Carrer de la Tardor, 1",
            city: "Barcelona",
            postcode: "08001",
            initTime: "12:17",
            endTime: undefined,
            status: "preparing",
            restaurant: "Ilustres Pizza",
            courier: undefined,
            uploadUser: "Alan Turing",
            customerName: "Rita Levi-Montalcini",
            customerPhone: "+39 1234567890",
            amount: 8.00
          },
          {
            id: "5",
            address: "Carrer de la Primavera, 1",
            city: "Barcelona",
            postcode: "08001",
            initTime: "12:17",
            endTime: undefined,
            status: "ready",
            restaurant: "Ilustres Pizza",
            courier: undefined,
            uploadUser: "Alan Turing",
            customerName: "Ada Lovelace",
            customerPhone: "+39 1234567890",
            amount: 25.75
          }
        ]
      },
      {
        id: "2",
        initTime: "12:30",
        deliveries: [
          {
            id: "9",
            address: "Carrer de la Tardor, 34",
            city: "Barcelona",
            postcode: "08001",
            initTime: "12:21",
            endTime: undefined,
            status: "preparing",
            restaurant: "Llibres Pizza",
            courier: undefined,
            uploadUser: "William Shakespeare",
            customerName: "Yoko Ono",
            customerPhone: "+39 1234567890",
            amount: 8.00
          },
          {
            id: "10",
            address: "Avinguda de la Primavera, 45",
            city: "Barcelona",
            postcode: "08001",
            initTime: "12:17",
            readyBy: "Pablo Neruda",
            readyTime: "12:23",
            endTime: undefined,
            status: "ready",
            restaurant: "Llibres Pizza",
            courier: undefined,
            uploadUser: "William Shakespeare",
            customerName: "Pol Pot",
            customerPhone: "+39 1234567890",
            amount: 25.75
          }
        ]
      }
    ];

    this.restaurants = [
      {
        id: "1",
        name: "Genis Pizza",
        address: "Carrer de la Mar, 190",
        city: "Barcelona",
        postcode: "08001",
        uploadUser: "Alan Turing",
        uploadDate: "10/03/2023",
        activeUsers: 4,
        numberOfDeliveries: 2
      },
      {
        id: "2",
        name: "Ilustres Pizza",
        address: "Carrer de les Estrelles, 87",
        city: "Barcelona",
        postcode: "08001",
        uploadUser: "Alan Turing",
        uploadDate: "10/03/2023",
        activeUsers: 3,
        numberOfDeliveries: 2
      },
      {
        id: "3",
        name: "Llibres Pizza",
        address: "Carrer de la Lluna, 5",
        city: "Barcelona",
        postcode: "08001",
        uploadUser: "Alan Turing",
        uploadDate: "10/03/2023",
        activeUsers: 2,
        numberOfDeliveries: 2
      }
    ];
  }
}

const dataService = new DataService();

// dataService.fillWithTestData();

export default dataService;