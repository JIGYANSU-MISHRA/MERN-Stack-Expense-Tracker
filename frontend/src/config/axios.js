import axios from 'axios';

// Create axios instance with base URL from environment variable
// In development, this will use the proxy from package.json
// In production (Vercel), this will use the Render backend URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

