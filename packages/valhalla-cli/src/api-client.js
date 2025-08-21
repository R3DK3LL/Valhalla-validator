const axios = require('axios');

class ValhallaApiClient {
  constructor() {
    // Use environment variable or default to Render URL
    this.baseUrl = process.env.VALHALLA_API_URL || 'https://valhalla-api.onrender.com';
    this.apiKey = process.env.VALHALLA_API_KEY;
  }

  async evaluate(repositoryData) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/evaluate`, {
        repository_data: repositoryData
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      return response.data;
    } catch (error) {
      throw new Error(`Evaluation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async generate(idea, options = {}) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        idea,
        options
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout for generation
      });

      return response.data;
    } catch (error) {
      throw new Error(`Generation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async validate(idea, targetScore = 80) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/validate`, {
        idea,
        target_score: targetScore
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000 // 15 second timeout
      });

      return response.data;
    } catch (error) {
      throw new Error(`Validation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseUrl}/health`, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }
}

module.exports = ValhallaApiClient;
