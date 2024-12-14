const { MongoClient } = require('mongodb');
const config = require('../config'); // Assuming config.js is in the parent directory

const uri = config.db.uri;
const client = new MongoClient(uri);
const database = client.db(config.db.database);
const collection = database.collection(config.db.collection);

async function insertData(carJson) {
  try {
    const data = [JSON.parse(carJson)];

    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} documents were inserted.`);
  } catch (error) {
    console.error('Error inserting car data:', error);
  }
}

async function getFilteredCars(filters) {
  try {
    const query = {};

    if (filters.priceMin || filters.priceMax) {
      query.price = {};
      if (filters.priceMin) query.price.$gte = filters.priceMin;
      if (filters.priceMax) query.price.$lte = filters.priceMax;
    }

    if (filters.make) query.make = filters.make;
    if (filters.location) query.location = filters.location;

    const cars = await collection.find(query).toArray();

    return cars;
  } catch (error) {
    console.error('Error fetching filtered cars:', error);
    return [];
  }
}

async function deleteCar(id) {
  try {
    const result = await collection.deleteOne({ id });
    if (result.deletedCount === 0) {
      console.log(`No car found with ID: ${id}`);
    } else {
      console.log(`Car with ID: ${id} was deleted.`);
    }
  } catch (error) {
    console.error('Error deleting car:', error);
  }
}

module.exports = { insertData, getFilteredCars, deleteCar };
async function main() {

  console.log("Inserting a car...");

  await insertData(JSON.stringify({  
    "id": "11",
    "title": "2001 Ford F-350 Lariat",
    "price": 5000,
    "make": "Ford",
    "model": "F-350",
    "year": 2001,
    "location": "Provo, UT",
    "contact_info": "seller11@example.com"
  })).catch(console.error);

  console.log("Fetching filtered cars...");

  const cars = await getFilteredCars({ priceMin: 5000, priceMax: 10000});
  console.log(cars);

  console.log("Deleting a car...");
  await deleteCar("11");
}
// main()
module.exports = { insertData, getFilteredCars, deleteCar };
