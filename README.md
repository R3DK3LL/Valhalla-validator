# VALHALLA
**Architecture Review & Quality Assurance Platform**

Automated code quality assessment and architecture validation for production deployment readiness.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![API Status](https://img.shields.io/badge/API-Live-green.svg)
![Development](https://img.shields.io/badge/Status-Active%20Development-orange.svg)

## Platform Capabilities

**Architecture Assessment**
![Progress](https://img.shields.io/badge/Core%20Engine-95%25-brightgreen.svg)
- Multi-dimensional code quality evaluation
- Gap identification with improvement recommendations  
- Production readiness verification
- Automated quality gates for deployment pipelines (87-97% compliance threshold)

**AI-Assisted Review**
![Progress](https://img.shields.io/badge/Integration-40%25-orange.svg)
- Natural language architecture analysis
- Multi-provider language model integration
- Quality-controlled output generation
- Technical documentation enhancement

**Development Integration**
![Progress](https://img.shields.io/badge/Tooling-50%25-orange.svg)
- REST API for programmatic access
- CLI tools for local development workflows
- CI/CD pipeline integration capabilities
- Extensible plugin architecture

## Assessment Framework

VALHALLA evaluates software architectures across established engineering dimensions:

| Component | Weight | Focus Areas |
|-----------|--------|-------------|
| **Frontend Architecture** | 10% | Component design, state management, user experience |
| **Backend Services** | 20% | API design, service architecture, data validation |
| **Data Management** | 15% | Database design, caching, persistence patterns |
| **DevOps Pipeline** | 15% | Build automation, testing, deployment strategies |
| **Infrastructure** | 15% | Cloud architecture, scalability, orchestration |
| **Monitoring & Observability** | 10% | Logging, metrics, alerting, performance tracking |
| **Security & Compliance** | 10% | Authentication, authorization, data protection |
| **Data Services** | 5% | Analytics, processing pipelines, model deployment |

## Current API Status

### Operational Endpoints
![Status](https://img.shields.io/badge/Status-Live-green.svg)
```bash
GET /health                    # Service health check
GET /api/health/matrix         # Assessment engine status
POST /api/test/score           # Architecture scoring with compliance gate
GET /api/test/debug            # Matrix structure inspection
```

### Development Endpoints
![Status](https://img.shields.io/badge/Status-In%20Development-orange.svg)
```bash
GET /api/constraints/prompt    # Constraint-enhanced prompt generation (Next)
POST /api/evaluate             # Full architecture evaluation (Planned)
POST /api/generate             # AI-assisted generation (Planned)
```

## Quick Start

### Architecture Scoring
```bash
# Test architecture compliance scoring
curl -X POST https://valhalla-api.onrender.com/api/test/score \
  -H "Content-Type: application/json" \
  -d '{"architecture": "React frontend with Node.js API, PostgreSQL database, Docker containers, Jenkins CI/CD, Prometheus monitoring, OAuth2 security"}'

# Example response: 93.68% score within 87-97% compliance range
```

### Health Check
```bash
# Verify service availability
curl https://valhalla-api.onrender.com/health

# Check assessment engine status
curl https://valhalla-api.onrender.com/api/health/matrix
```

### Development Setup
```bash
# Clone repository
git clone https://github.com/R3DK3LL/Valhalla-validator.git
cd Valhalla-validator

# Install dependencies
npm install

# Start development server
npm run dev
```

## Package Development Status

| Package | Status | Description |
|---------|--------|-------------|
| **valhalla-api** | ![Dev](https://img.shields.io/badge/Core-95%25-brightgreen.svg) | REST API service with assessment engine |
| **valhalla-cli** | ![Plan](https://img.shields.io/badge/CLI-Planned-red.svg) | Command line interface for local development |
| **valhalla-action** | ![Plan](https://img.shields.io/badge/CI%2FCD-Planned-red.svg) | GitHub Action for automated review |

## Architecture Assessment Engine

The platform employs proprietary evaluation algorithms to assess software architectures against industry standards and best practices. The assessment framework:

- **Multi-dimensional Analysis** - Evaluates across 8 critical architecture domains
- **Weighted Scoring** - Applies industry-standard importance weights to different components
- **Quality Thresholds** - Enforces 87-97% compliance gates for deployment readiness
- **Gap Analysis** - Identifies specific areas requiring improvement with actionable recommendations
- **Keyword Detection** - Advanced pattern matching across technical domains

### Scoring Examples
```bash
# Comprehensive architecture example
Score: 93.68% (OPTIMAL tier, compliant)
- Frontend: 85% coverage
- Backend: 86.7% coverage  
- Data Layer: 94% coverage
- DevOps: 96.3% coverage

# Basic architecture example
Score: 40.5% (FAIL tier, non-compliant)
- Missing observability components
- Insufficient security measures
- Limited infrastructure coverage
```

## Language Model Integration

![Status](https://img.shields.io/badge/Integration-Development-orange.svg)

Planned support for leading AI providers through user-supplied API keys:

- **OpenAI GPT Models** - Advanced technical analysis and reasoning
- **Anthropic Claude** - Detailed architectural planning and documentation
- **Google Gemini** - Pattern recognition and multi-modal analysis

The platform applies quality control mechanisms to ensure AI-generated outputs meet the 87-97% compliance threshold before release.

## Security & Intellectual Property

- **Proprietary Assessment Logic** - Core evaluation algorithms protected via AES-256 encryption
- **Secure Key Management** - Environment-based secret management with rotation
- **Zero-Trust Design** - No sensitive evaluation criteria exposed in public repositories  
- **Memory-Only Processing** - Sensitive algorithms decrypted in memory during execution
- **Compliance Enforcement** - Multi-layer quality gates prevent non-compliant outputs

## Development Roadmap

### Phase 1: Core Engine ✅ 95%
- [x] Assessment framework foundation
- [x] Encrypted evaluation matrix system
- [x] Health monitoring endpoints
- [x] Architecture scoring endpoints with 87-97% compliance gate

### Phase 2: API Integration 🔄 60%
- [x] Architecture scoring with detailed breakdown
- [x] Quality threshold enforcement
- [ ] Constraint-enhanced prompt generation
- [ ] Results formatting and reporting

### Phase 3: AI Integration 📋 40%
- [ ] Language model provider clients
- [x] Quality-controlled generation pipeline foundation
- [x] Output validation and filtering (87-97% gate)
- [ ] Multi-provider result comparison

### Phase 4: Developer Tools 📋 10%
- [ ] Command line interface
- [ ] GitHub Actions integration
- [ ] Local development workflow
- [ ] Documentation generation

## Testing & Validation

The assessment engine has been validated with real-world architecture examples:

**Passing Example (93.68% score):**
- Comprehensive full-stack architecture with monitoring, security, and infrastructure
- All 8 domains adequately covered
- Meets production deployment standards

**Failing Example (40.5% score):**
- Basic architecture missing critical components
- Insufficient observability and security measures
- Requires enhancement before production deployment

## Contributing

Development contributions are welcome. Please review the current development status before submitting pull requests:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/enhancement`)
3. Commit changes with clear descriptions
4. Push to branch (`git push origin feature/enhancement`)
5. Create Pull Request with detailed description

## Technical Requirements

```bash
# Environment Configuration
NODE_ENV=production
PORT=3000

# Assessment Engine (Operational)
MATRIX_ENCRYPTION_KEY=configured

# Future LLM Integration (Development Phase)
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Project Status

The core assessment engine is operational with validated 87-97% compliance gates. Architecture scoring endpoints are live and functional. AI integration and enhanced developer tools are in active development.

For technical questions or feature requests, use [GitHub Issues](https://github.com/R3DK3LL/Valhalla-validator/issues).

---

**Maintained by [R3DK3LL](https://github.com/R3DK3LL)**