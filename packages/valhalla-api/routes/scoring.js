const express = require('express');
const MatrixClient = require('../core/matrix-client');

const router = express.Router();

// POST /score - Test architecture scoring against matrix using existing algorithms
router.post('/score', async (req, res) => {
  try {
    const { architecture } = req.body;
    
    if (!architecture || typeof architecture !== 'string') {
      return res.status(400).json({
        error: 'Architecture text is required',
        status: 'error'
      });
    }

    console.log('Scoring architecture text:', architecture.substring(0, 100) + '...');
    
    // Use existing MatrixClient with all your blackbox algorithms
    const matrixClient = new MatrixClient();
    
    // Use your existing scoring method from blackbox
    const scoringResults = await matrixClient.scoreArchitecture(architecture);
    
    // Use your existing gate application method
    const gateResult = await matrixClient.applyGate(architecture);
    
    // Get matrix health for context
    const matrixHealth = await matrixClient.healthCheck();
    
    const response = {
      status: 'success',
      timestamp: new Date().toISOString(),
      input: {
        architectureLength: architecture.length,
        preview: architecture.substring(0, 100) + (architecture.length > 100 ? '...' : '')
      },
      scoring: scoringResults,
      gate: gateResult,
      matrix: {
        health: matrixHealth.status,
        layerCount: matrixHealth.layerCount,
        totalWeight: matrixHealth.totalWeight
      }
    };

    res.json(response);
    
  } catch (error) {
    console.error('Scoring endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error during scoring',
      message: error.message,
      status: 'error',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
