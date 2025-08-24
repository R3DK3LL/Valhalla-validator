// Add this to your existing API routes (likely in packages/valhalla-api/src/routes/ or similar)

const express = require('express');
const MatrixClient = require('../core/matrix-client');

const router = express.Router();

// POST /api/test/score - Test architecture scoring against matrix
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
    
    // Initialize matrix client
    const matrixClient = new MatrixClient();
    await matrixClient.init();
    
    // Get matrix data for scoring
    const matrix = matrixClient.getMatrix();
    if (!matrix) {
      throw new Error('Matrix not loaded');
    }

    // Extract layers and weights for scoring
    const layers = matrix.TAXONOMY?.layers || {};
    const weights = matrix.EVAL_CRITERIA?.weights_pct || {};
    
    console.log('Available layers:', Object.keys(layers));
    console.log('Available weights:', Object.keys(weights));

    // Perform architecture scoring
    const scoringResults = performArchitectureScoring(architecture, layers, weights);
    
    // Apply 87-97% gate
    const gateResult = applyComplianceGate(scoringResults.totalScore);
    
    const response = {
      status: 'success',
      timestamp: new Date().toISOString(),
      input: {
        architectureLength: architecture.length,
        preview: architecture.substring(0, 100) + (architecture.length > 100 ? '...' : '')
      },
      scoring: {
        totalScore: scoringResults.totalScore,
        layerScores: scoringResults.layerScores,
        keywordMatches: scoringResults.keywordMatches,
        diversityBonus: scoringResults.diversityBonus
      },
      compliance: {
        gate: gateResult,
        threshold: { min: 87, max: 97 },
        passed: gateResult.passed,
        action: gateResult.action
      },
      matrix: {
        layerCount: Object.keys(layers).length,
        totalWeight: Object.values(weights).reduce((sum, w) => sum + w, 0)
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

// Architecture scoring logic
function performArchitectureScoring(architectureText, layers, weights) {
  const text = architectureText.toLowerCase();
  const layerScores = {};
  const keywordMatches = {};
  let totalScore = 0;
  let uniqueKeywordsFound = new Set();

  // Score each layer based on keyword matches
  for (const [layerName, layerData] of Object.entries(layers)) {
    const layerWeight = weights[layerName] || 0;
    const keywords = layerData.keywords || [];
    
    let layerKeywordMatches = 0;
    let layerMatchedKeywords = [];
    
    // Check each keyword in the architecture text
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        layerKeywordMatches++;
        layerMatchedKeywords.push(keyword);
        uniqueKeywordsFound.add(keyword);
      }
    }
    
    // Calculate layer score (percentage of keywords matched * weight)
    const keywordCoverage = keywords.length > 0 ? layerKeywordMatches / keywords.length : 0;
    const layerScore = keywordCoverage * layerWeight;
    
    layerScores[layerName] = {
      score: layerScore,
      weight: layerWeight,
      keywordMatches: layerKeywordMatches,
      totalKeywords: keywords.length,
      coverage: keywordCoverage,
      matchedKeywords: layerMatchedKeywords
    };
    
    keywordMatches[layerName] = layerMatchedKeywords;
    totalScore += layerScore;
  }
  
  // Add diversity bonus (bonus for covering multiple layers)
  const layersWithMatches = Object.values(layerScores).filter(layer => layer.keywordMatches > 0).length;
  const totalLayers = Object.keys(layers).length;
  const diversityBonus = (layersWithMatches / totalLayers) * 5; // Up to 5 point bonus
  
  totalScore += diversityBonus;
  
  return {
    totalScore: Math.round(totalScore * 100) / 100,
    layerScores,
    keywordMatches,
    diversityBonus: Math.round(diversityBonus * 100) / 100,
    uniqueKeywordsCount: uniqueKeywordsFound.size
  };
}

// Apply 87-97% compliance gate
function applyComplianceGate(score) {
  const minThreshold = 87;
  const maxThreshold = 97;
  
  if (score >= minThreshold && score <= maxThreshold) {
    return {
      passed: true,
      score: score,
      action: 'accept',
      message: 'Architecture meets compliance requirements'
    };
  } else if (score < minThreshold) {
    return {
      passed: false,
      score: score,
      action: 'regenerate',
      message: `Score ${score}% below minimum threshold of ${minThreshold}%`
    };
  } else {
    return {
      passed: false,
      score: score,
      action: 'regenerate', 
      message: `Score ${score}% above maximum threshold of ${maxThreshold}%`
    };
  }
}

module.exports = router;
