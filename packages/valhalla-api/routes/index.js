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

// Mount route modules
router.use('/evaluate', evaluateRouter);
router.use('/generate', generateRouter);
router.use('/validate', validateRouter);

module.exports = router;
