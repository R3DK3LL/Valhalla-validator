const express = require('express');
const router = express.Router();

// Import route modules
const evaluateRouter = require('./evaluate');
const generateRouter = require('./generate');
const validateRouter = require('./validate');

// Health check for API routes
router.get('/health', (req, res) => {
  res.json({
    status: 'API routes healthy',
    endpoints: ['/evaluate', '/generate', '/validate']
  });
});

// Matrix health check with cache clearing option
router.get('/health/matrix', async (req, res) => {
  try {
    const MatrixClient = require('../core/matrix-client');
    const matrixClient = new MatrixClient();
    
    // Clear cache if requested
    if (req.query.fresh === 'true') {
      matrixClient.clearCache();
    }
    
    const healthStatus = await matrixClient.healthCheck();
    
    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      matrix: healthStatus
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Mount route modules
router.use('/evaluate', evaluateRouter);
router.use('/generate', generateRouter);
router.use('/validate', validateRouter);

module.exports = router;
