import axios from "axios";
// const BASE_URL = "https://iemecommerce-api.onrender.com";
const BASE_URL = "http://localhost:5000";

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    'Origin': 'http://localhost:5173' 
  }
});

