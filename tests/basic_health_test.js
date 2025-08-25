const axios = require('axios');
const BASE_URL = 'https://valhalla-api.onrender.com';

async function testServiceHealth() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('Service Health:', response.data.status);
    return response.data.status === 'healthy';
  } catch (error) {
    console.error('Health check failed:', error.message);
    return false;
  }
}

async function testBasicScoring() {
  try {
    const response = await axios.post(`${BASE_URL}/api/test/score`, {
      architecture: 'React frontend with Node.js API and PostgreSQL database'
    });
    console.log('Basic scoring test - Score:', response.data.scoring.percentage + '%');
    return response.data.status === 'success';
  } catch (error) {
    console.error('Basic scoring failed:', error.message);
    return false;
  }
}

module.exports = { testServiceHealth, testBasicScoring };
