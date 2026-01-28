import axios from "axios";

// ✅ Use your actual IP address
const API_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Enhanced error logging
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      code: error.code,
      fullError: error
    });
    
    if (error.message === 'Network Error') {
      console.log('Network Error - Possible causes:');
      console.log('1. Phone not on same WiFi as PC');
      console.log('2. Firewall blocking port 8000');
      console.log('3. Django server not running');
      console.log('4. Wrong IP address in API_URL');
    }
    
    return Promise.reject(error);
  }
);

export const testConnection = async () => {
  try {
    console.log('🔗 Testing connection to:', API_URL);
    const response = await fetch(`${API_URL}/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    console.log('✅ Server responded:', response.status);
    return true;
  } catch {
    console.error('❌ Cannot reach server:');
    return false;
  }
};

// services/api.js
// export const api = {
//   get: async (endpoint, config) => {
//     const response = await fetch(endpoint, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${yourToken}`,
//         'Content-Type': 'application/json',
//       },
//       ...config,
//     });
//     return response.json();
//   },
//   post: async (endpoint, data, config) => {
//     const response = await fetch(endpoint, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${yourToken}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//       ...config,
//     });
//     return response.json();
//   },
// };

export const endpoints = {
   activities: {
     recent: '/api/activities/recent',
   },
   goals: {
     active: '/api/goals/active',
   },
   health: {
     metrics: '/api/health/metrics',
    doctors: '/api/health/doctors',
   },
   devices: {
     connected: '/api/devices/connected',
     sync: '/api/devices/sync',
   },
   stats: {
    daily: '/api/stats/daily',
  }
 };

export default api;