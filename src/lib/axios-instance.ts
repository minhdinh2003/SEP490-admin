// lib/axiosInstance.js
import axios from 'axios';

import { useAuthStore } from '@/store/use-auth-store';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  // timeout: 1000,
  headers: { 'Content-Type': 'application/json' }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    console.log(token);
    // const token = "";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Do something with the response data
    return response;
  },
  (error) => {
    // Handle the response error
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error
      console.error('Unauthorized, logging out...');
      // Perform any logout actions or redirect to login page
      useAuthStore.getState().signOut();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
