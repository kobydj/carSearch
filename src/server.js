// Import necessary packages
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import functions from MongoClient.ts
const { insertData, getFilteredCars, deleteCar } = require('./mongoClient');

// Initialize the Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json()); // For parsing application/json

// Route to insert car data
app.post('/api/cars', async (req, res) => {
  try {
    const carData = req.body; // Assuming the body contains the car JSON
    await insertData(JSON.stringify(carData));
    res.status(201).json({ message: 'Car inserted successfully' });
  } catch (error) {
    console.error('Error inserting car:', error);
    res.status(500).json({ message: 'Failed to insert car' });
  }
});

// Route to get filtered cars
app.get('/api/cars', async (req, res) => {
  try {
    const { priceMin, priceMax, make, location } = req.query; // Query params for filtering

    const filters = {
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
      make: make || undefined,
      location: location || undefined
    };

    const cars = await getFilteredCars(filters);
    res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Failed to fetch cars' });
  }
});

// Route to delete a car by ID
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await deleteCar(id);
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Failed to delete car' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});