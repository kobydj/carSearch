import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    make: '',
    location: ''
  });
  const [newCar, setNewCar] = useState({
    title: '',
    price: '',
    make: '',
    model: '',
    year: '',
    location: '',
    contact_info: ''
  });

  // Fetch cars from the backend with filters
  useEffect(() => {
    const fetchCars = async () => {
      try {
        // Convert price filters to numbers (if they are not empty)
        const filtersWithNumbers = {
          ...filters,
          priceMin: filters.priceMin ? Number(filters.priceMin) : '',
          priceMax: filters.priceMax ? Number(filters.priceMax) : ''
        };
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/cars`, {
          params: filtersWithNumbers
        });
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, [filters]); // Fetch when filters change

  // Handle filter input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Handle new car input change
  const handleNewCarChange = (e) => {
    const { name, value } = e.target;
    setNewCar((prevNewCar) => ({
      ...prevNewCar,
      [name]: value
    }));
  };

  // Handle new car form submission
  const handleCreateCar = async (e) => {
    e.preventDefault();

    // Convert price and year to numbers
    const carData = {
      ...newCar,
      price: Number(newCar.price),
      year: Number(newCar.year)
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/cars`, carData);
      setCars((prevCars) => [...prevCars, response.data]); // Add the new car to the list
      setNewCar({
        title: '',
        price: '',
        make: '',
        model: '',
        year: '',
        location: '',
        contact_info: ''
      }); // Clear the form
    } catch (error) {
      console.error('Error creating car ad:', error);
    }
  };

  return (
    <div>
      <h1>Car Listings</h1>

      {/* Filter Form */}
      <div>
        <h2>Filter Cars</h2>
        <form>
          <input
            type="number"
            name="priceMin"
            value={filters.priceMin}
            onChange={handleFilterChange}
            placeholder="Min Price"
          />
          <input
            type="number"
            name="priceMax"
            value={filters.priceMax}
            onChange={handleFilterChange}
            placeholder="Max Price"
          />
          <input
            type="text"
            name="make"
            value={filters.make}
            onChange={handleFilterChange}
            placeholder="Make"
          />
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Location"
          />
        </form>
      </div>

      {/* Car Listing */}
      {cars.length === 0 ? (
        <p>No cars found</p>
      ) : (
        <ul>
          {cars.map((car) => (
            <li key={car.id}>
              <h3>{car.title} ({car.year})</h3>
              <p>{car.make} {car.model}</p>
              <p>Price: ${car.price}</p>
              <p>Location: {car.location}</p>
              <p>Contact: {car.contact_info}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Create New Car Ad Form */}
      <div>
        <h2>Create New Car Ad</h2>
        <form onSubmit={handleCreateCar}>
          <input
            type="text"
            name="title"
            value={newCar.title}
            onChange={handleNewCarChange}
            placeholder="Car Title"
          />
          <input
            type="number"
            name="price"
            value={newCar.price}
            onChange={handleNewCarChange}
            placeholder="Price"
          />
          <input
            type="text"
            name="make"
            value={newCar.make}
            onChange={handleNewCarChange}
            placeholder="Make"
          />
          <input
            type="text"
            name="model"
            value={newCar.model}
            onChange={handleNewCarChange}
            placeholder="Model"
          />
          <input
            type="number"
            name="year"
            value={newCar.year}
            onChange={handleNewCarChange}
            placeholder="Year"
          />
          <input
            type="text"
            name="location"
            value={newCar.location}
            onChange={handleNewCarChange}
            placeholder="Location"
          />
          <input
            type="email"
            name="contact_info"
            value={newCar.contact_info}
            onChange={handleNewCarChange}
            placeholder="Contact Info"
          />
          <button type="submit">Create Ad</button>
        </form>
      </div>
    </div>
  );
}

export default App;
