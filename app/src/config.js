require('dotenv').config();
console.log('process.env.REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
console.log('process.env.REACT_APP_WS_URL:', process.env.REACT_APP_WS_URL);
console.log('process.env:', process.env.REACT_APP_API_BASE_URL);
const { contextBridge } = require('electron');

const config = {
  // API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
  WS_URL: process.env.REACT_APP_WS_URL || 'ws://localhost:3000',
};

export default config;

