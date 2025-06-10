import axios from 'axios';
import { logoutUser } from '../context/AuthContext';
import { toast } from 'react-toastify';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ Always send cookies with requests
});


// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,       //Goes into consumers' try()
  (error) => {
    console.log('API call crashed... error :',error);

    // Handle ALL errors globally
    if (!error.response) {
      toast.error('Network error');
    } else if (error.response.status >= 500) {
      toast.error('Server error occurred');
    } else if (error.response.status === 400) {
      logoutUser();
      if(window.location.pathname !== '/') window.location.href = '/';
    }

    return Promise.reject(error);  //Goes into consumers' catch()
  }
);

export default api;