// Importing Axios library for making HTTP requests
import axios from "axios";

// Base URL for API endpoints
// const BASE_URL = "https://iemecommerce-api.onrender.com/";
// Local development URL
const BASE_URL = "http://localhost:5000";

// Creating an Axios instance with baseURL set to BASE_URL
// This allows us to make API requests with the configured baseURL
export default axios.create({
  baseURL: BASE_URL,
});
