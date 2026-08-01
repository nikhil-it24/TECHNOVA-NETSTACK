import axios from 'axios';

// Auto-detect base URL: works both on Vite dev server (port 5173 -> backend 8000)
// and on single host deployment (port 8000 -> relative APIs)
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    if (window.location.port === '5173') {
      return 'http://localhost:8000';
    }
    return window.location.origin;
  }
  return 'http://localhost:8000';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

export default api;
