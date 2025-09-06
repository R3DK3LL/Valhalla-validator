const crypto = require('crypto');
const axios = require('axios');

class MatrixClient {
    constructor(config = {}) {
        this.githubRepo = config.githubRepo || 'https://raw.githubusercontent.com/R3DK3LL/Valhalla-validator/main';
        this.matrixPath = config.matrixPath || 'matrix/encrypted-matrix.json';
        this.encryptionKey = config.encryptionKey || process.env.MATRIX_ENCRYPTION_KEY;
        this.cacheTTL = config.cacheTTL || 3600000; // 1 hour default
        this.cache = new Map();
        this.algorithm = 'aes-256-cbc';
        this.scoreThreshold = { min: 87, max: 97 };
    }

    /**
     * Fetch encrypted matrix from GitHub
     */
    async fetchEncryptedMatrix() {
        try {
            const url = `${this.githubRepo}/${this.matrixPath}`;
            if (process.env.DEBUG) console.log(`Fetching encrypted matrix from: ${url}`);
            
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Valhalla-API/1.0'
                }
            });
            
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error('Encrypted matrix not found in repository. Has it been synced?');
            }
            throw new Error(`Failed to fetch matrix: ${error.message}`);
        }
    }

    /**
     * Decrypt matrix data
     */
    decryptMatrix(encryptedPackage, keyBase64) {
        try {
            const { encrypted, iv, hash, algorithm } = encryptedPackage;
            
            // Verify algorithm
            if (algorithm !== this.algorithm) {
                throw new Error(`Unsupported encryption algorithm: ${algorithm}`);
            }
            
            if (!keyBase64) {
                throw new Error('Encryption key not provided');
            }
            
            // Convert key and IV from base64
            const key = Buffer.from(keyBase64, 'base64');
            const ivBuffer = Buffer.from(iv, 'base64');
            
            // Create decipher
            const decipher = crypto.createDecipher(this.algorithm, key);
            decipher.setAutoPadding(true);
            
            // Decrypt data
            let decrypted = decipher.update(encrypted, 'base64', 'utf8');
            decrypted += decipher.final('utf8');
            
            // Verify integrity
            const decryptedHash = crypto.createHash('sha256').update(decrypted, 'utf8').digest('hex');
            if (decryptedHash !== hash) {
                throw new Error('Matrix integrity verification failed');
            }
            
            return JSON.parse(decrypted);
        } catch (error) {
            throw new Error(`Matrix decryption failed: ${error.message}`);
        }
    }

    /**
     * Load and cache matrix
     */
    async loadMatrix() {
        const cacheKey = 'decrypted_matrix';
        
        // Check cache first
        const cached = this.cache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp < this.cacheTTL)) {
            if (process.env.DEBUG) console.log('Using cached matrix');
            return cached.matrix;
        }
        
        try {
            if (process.env.DEBUG) console.log('Loading fresh matrix...');
            
            // Fetch encrypted matrix
            const encryptedData = await this.fetchEncryptedMatrix();
            
            // Decrypt matrix
            const matrix = this.decryptMatrix(encryptedData, this.encryptionKey);
            
            // Cache result
            this.cache.set(cacheKey, {
                matrix,
                timestamp: Date.now()
            });
            
            if (process.env.DEBUG) console.log(`Matrix loaded successfully with ${Object.keys(matrix).length} top-level keys`);
            return matrix;
        } catch (error) {
            console.error('Matrix loading failed:', error.message);
            throw error;
        }
    }

    /**
     * Extract layer weights from matrix
     */
    async getLayerWeights() {
        const matrix = await this.loadMatrix();
        
        try {
            // Based on your document structure: LAYER_DEFINITIONS
            const layerDefs = matrix.EVAL_CRITERIA?.weights_pct || {};
            // Convert percentage strings to numbers
            const weights = {};
            for (const [layer, weightStr] of Object.entries(layerDefs)) {
                if (typeof weightStr === 'string') {
                    // Handle formats like "10_PERCENT" or "10%"
                    const numericWeight = parseInt(weightStr.replace(/[^0-9]/g, ''));
                    weights[layer] = isNaN(numericWeight) ? 0 : numericWeight;
                } else {
                    weights[layer] = weightStr;
                }
            }
            
            return weights;
        } catch (error) {
            throw new Error(`Failed to extract layer weights: ${error.message}`);
        }
    }

    /**
     * Get layer requirements for constraint generation
     */
    async getLayerRequirements() {
        const matrix = await this.loadMatrix();
        
        try {
            const requirements = {};
            const weights = await this.getLayerWeights();
            
            // Build requirements from layer weights and descriptions
            for (const [layer, weight] of Object.entries(weights)) {
                requirements[layer] = {
                    weight: weight,
                    required: weight > 0,
                    description: this.getLayerDescription(layer),
                    keywords: this.getLayerKeywords(layer),
                    minMentions: Math.ceil(weight / 10) // Scale mentions to weight
                };
            }
            
            return requirements;
        } catch (error) {
            throw new Error(`Failed to extract layer requirements: ${error.message}`);
        }
    }

    /**
     * Helper to get layer descriptions
     */
    getLayerDescription(layer) {
        const descriptions = {
            FRONTEND_UI_WEIGHT: 'User interface, components, and user experience design',
            BACKEND_API_WEIGHT: 'Server-side APIs, business logic, and service architecture',
            DATA_LAYER_WEIGHT: 'Data storage, databases, models, and persistence layers',
            ML_SERVICES_WEIGHT: 'Machine learning services, AI integration, and data processing',
            DEVOPS_CICD_WEIGHT: 'CI/CD pipelines, deployment automation, and development workflows',
            INFRA_RUNTIME_WEIGHT: 'Infrastructure, cloud services, containers, and runtime environments',
            OBSERVABILITY_WEIGHT: 'Monitoring, logging, metrics, tracing, and system observability',
            SECURITY_COMPLIANCE_WEIGHT: 'Security measures, authentication, authorization, and compliance'
        };
        
        return descriptions[layer] || descriptions[layer.toUpperCase()] || 'Architecture layer component';
    }

    /**
     * Get keywords for layer scoring
     */
    getLayerKeywords(layer) {
    // Convert layer name to keyword map key
    const layerToKeyMap = {
        'frontend_ui': 'FRONTEND_UI_WEIGHT',
        'backend_api': 'BACKEND_API_WEIGHT',
        'data_layer': 'DATA_LAYER_WEIGHT',
        'ml_services_optional': 'ML_SERVICES_WEIGHT',
        'devops_ci_cd': 'DEVOPS_CICD_WEIGHT',
        'infra_runtime': 'INFRA_RUNTIME_WEIGHT',
        'observability': 'OBSERVABILITY_WEIGHT',
        'security_compliance': 'SECURITY_COMPLIANCE_WEIGHT'
    };

    const keywordMap = {
        FRONTEND_UI_WEIGHT: ['frontend', 'ui', 'user interface', 'react', 'vue', 'angular', 'component', 'css', 'html', 'javascript'],
        BACKEND_API_WEIGHT: ['backend', 'api', 'server', 'rest', 'graphql', 'microservice', 'service', 'endpoint', 'controller'],
        DATA_LAYER_WEIGHT: ['database', 'data', 'storage', 'sql', 'nosql', 'mongodb', 'postgresql', 'redis', 'model', 'schema'],
        ML_SERVICES_WEIGHT: ['machine learning', 'ml', 'ai', 'model', 'tensorflow', 'pytorch', 'data science', 'algorithm'],
        DEVOPS_CICD_WEIGHT: ['devops', 'ci/cd', 'pipeline', 'docker', 'kubernetes', 'deployment', 'automation', 'jenkins'],
        INFRA_RUNTIME_WEIGHT: ['infrastructure', 'cloud', 'aws', 'azure', 'gcp', 'container', 'kubernetes', 'runtime'],
        OBSERVABILITY_WEIGHT: ['monitoring', 'logging', 'metrics', 'tracing', 'observability', 'prometheus', 'grafana'],
        SECURITY_COMPLIANCE_WEIGHT: ['security', 'authentication', 'authorization', 'compliance', 'encryption', 'oauth']
    };
    
    const keywordKey = layerToKeyMap[layer];
    return keywordMap[keywordKey] || [];
}

    /**
     * Build constraint prompts for LLM
     */
    async buildConstraintPrompts() {
        try {
            const layerWeights = await this.getLayerWeights();
            const requirements = await this.getLayerRequirements();
            
            let constraints = 'ARCHITECTURE REQUIREMENTS:\n\n';
            constraints += 'Your architecture must address these weighted components:\n\n';
            
            // Sort by weight (highest first)
            const sortedLayers = Object.entries(layerWeights)
                .sort(([,a], [,b]) => b - a)
                .filter(([,weight]) => weight > 0);
            
            for (const [layer, weight] of sortedLayers) {
                const req = requirements[layer];
                constraints += `${layer.replace(/_/g, ' ').replace(' WEIGHT', '')}: ${weight}% importance\n`;
                constraints += `  • ${req.description}\n`;
                constraints += `  • Include specific details and technologies\n\n`;
            }
            
            constraints += 'SCORING CRITERIA:\n';
            constraints += '• Each layer must be adequately addressed proportional to its weight\n';
            constraints += '• Use specific technologies and implementation details\n';
            constraints += '• Explain architectural decisions and trade-offs\n';
            constraints += '• Target score range: 87-97% compliance\n\n';
            
            constraints += 'OUTPUT FORMAT:\n';
            constraints += '• Provide natural language description (NOT JSON)\n';
            constraints += '• Include all required architectural layers\n';
            constraints += '• Use technical terminology appropriately\n';
            
            return {
                constraints,
                weights: layerWeights,
                requirements,
                totalWeight: Object.values(layerWeights).reduce((sum, w) => sum + w, 0)
            };
        } catch (error) {
            throw new Error(`Failed to build constraint prompts: ${error.message}`);
        }
    }

    /**
     * Score architecture against matrix
     */
    async scoreArchitecture(architectureText) {
        try {
            const layerWeights = await this.getLayerWeights();
            const requirements = await this.getLayerRequirements();
            
            let totalScore = 0;
            let maxPossibleScore = 0;
            const scoreDetails = {};
            const gaps = [];
            
            // Score each layer
            for (const [layer, weight] of Object.entries(layerWeights)) {
                if (weight === 0) continue;
                
                maxPossibleScore += weight;
                const req = requirements[layer];
                
                // Count keyword mentions (case insensitive)
                const text = architectureText.toLowerCase();
                let mentions = 0;
                
                for (const keyword of req.keywords) {
                    const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
                    const matches = text.match(regex);
                    mentions += matches ? matches.length : 0;
                }
                
                // Calculate layer score (0-100% of weight)
                const expectedMentions = req.minMentions;
                const mentionScore = Math.min(mentions / expectedMentions, 1);
                
                // Bonus for diverse keyword coverage
                const uniqueKeywords = req.keywords.filter(keyword => 
                    text.includes(keyword.toLowerCase())
                ).length;
                const diversityBonus = uniqueKeywords / req.keywords.length;
                
                // Combined score with 70% mention weight, 30% diversity
                const layerScore = (mentionScore * 0.7 + diversityBonus * 0.3) * weight;
                totalScore += layerScore;
                
                scoreDetails[layer] = {
                    weight,
                    mentions,
                    expectedMentions,
                    uniqueKeywords,
                    totalKeywords: req.keywords.length,
                    score: layerScore,
                    percentage: (layerScore / weight) * 100
                };
                
                // Identify gaps
                if (layerScore < weight * 0.5) { // Less than 50% of possible
                    gaps.push({
                        layer: layer.replace(/_/g, ' ').replace(' WEIGHT', ''),
                        issue: mentions === 0 ? 'Not addressed' : 'Insufficient detail',
                        expected: weight,
                        actual: layerScore
                    });
                }
            }
            
            // Calculate final percentage
            const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
            
            // Determine tier and compliance
            let tier = 'FAIL';
            let compliant = false;
            
            if (percentage >= this.scoreThreshold.min && percentage <= this.scoreThreshold.max) {
                tier = 'OPTIMAL';
                compliant = true;
            } else if (percentage >= this.scoreThreshold.max) {
                tier = 'OVER_ENGINEERED';
            } else if (percentage >= 70) {
                tier = 'GOOD';
            } else if (percentage >= 50) {
                tier = 'BASIC';
            }
            
            return {
                percentage: Math.round(percentage * 100) / 100,
                tier,
                compliant,
                totalScore,
                maxPossibleScore,
                scoreDetails,
                gaps,
                threshold: this.scoreThreshold,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            throw new Error(`Architecture scoring failed: ${error.message}`);
        }
    }

    /**
     * Apply 87-97% scoring gate
     */
    async applyGate(architectureText, maxAttempts = 3) {
        const results = [];
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            if (process.env.DEBUG) console.log(`Gate evaluation attempt ${attempt}/${maxAttempts}`);
            
            const score = await this.scoreArchitecture(architectureText);
            results.push(score);
            
            if (score.compliant) {
                return {
                    success: true,
                    attempt,
                    score,
                    output: architectureText,
                    message: `Architecture meets compliance requirements (${score.percentage}%)`
                };
            }
            
            // If not last attempt, provide feedback for regeneration
            if (attempt < maxAttempts) {
                if (process.env.DEBUG) console.log(`Score ${score.percentage}% - ${score.tier}. Regeneration needed.`);
            }
        }
        
        // All attempts failed
        const lastScore = results[results.length - 1];
        return {
            success: false,
            attempts: maxAttempts,
            score: lastScore,
            output: null,
            message: `Architecture failed to meet compliance after ${maxAttempts} attempts. Final score: ${lastScore.percentage}%`,
            allResults: results
        };
    }

    /**
     * Generate constraint-enhanced prompt for LLM
     */
    async enhancePromptWithConstraints(userPrompt) {
        try {
            const constraintData = await this.buildConstraintPrompts();
            
            const enhancedPrompt = `${userPrompt}

${constraintData.constraints}

Remember: Focus on delivering a comprehensive architecture that addresses all weighted components appropriately. The architecture should be practical, well-reasoned, and demonstrate clear understanding of each layer's requirements.`;

            return {
                enhancedPrompt,
                originalPrompt: userPrompt,
                constraints: constraintData.constraints,
                weights: constraintData.weights
            };
        } catch (error) {
            throw new Error(`Prompt enhancement failed: ${error.message}`);
        }
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        if (process.env.DEBUG) console.log('Matrix cache cleared');
    }

    /**
     * Get cache status
     */
    getCacheStatus() {
        const cacheKey = 'decrypted_matrix';
        const cached = this.cache.get(cacheKey);
        
        return {
            cached: !!cached,
            timestamp: cached?.timestamp,
            age: cached ? Date.now() - cached.timestamp : null,
            ttl: this.cacheTTL
        };
    }

    /**
     * Health check
     */
    async healthCheck() {
        try {
            const matrix = await this.loadMatrix();
            const cacheStatus = this.getCacheStatus();
            
            // Extract from correct matrix structure
            const layers = matrix.TAXONOMY?.layers || {};
            const weights = matrix.EVAL_CRITERIA?.weights_pct || {};
            
            return {
                status: 'healthy',
                matrixLoaded: true,
                layerCount: Object.keys(layers).length,
                totalWeight: Object.values(weights).reduce((sum, w) => sum + w, 0),
                cache: cacheStatus,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}
module.exports = MatrixClient;
