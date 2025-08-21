# VALHALLA
**Enterprise Architecture Evaluation & Generation Platform**

Transform ideas into production-ready architectures with automated compliance scoring and intelligent constraint enforcement.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![API Status](https://img.shields.io/badge/API-Live-green.svg)](https://valhalla-api.onrender.com)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

## Quick Start

```bash
# Install CLI
npm install -g @valhalla/cli

# Evaluate existing architecture
valhalla evaluate ./my-project

# Generate architecture from concept
valhalla generate "Real-time collaborative application with offline sync"

# Check API health
curl https://valhalla-api.onrender.com/health
```

## Core Features

**Architecture Evaluation**
- Comprehensive scoring across multiple architectural dimensions
- Gap analysis with specific improvement recommendations
- Compliance verification against industry best practices
- Automated quality gates for CI/CD integration

**AI-Powered Generation**
- Transform high-level concepts into detailed technical architectures
- Multi-provider LLM integration for diverse analytical perspectives
- Constraint-based generation ensuring production readiness
- Natural language output optimized for technical teams

**Enterprise Integration**
- REST API for programmatic access
- GitHub Actions for automated evaluation in pull requests
- CLI tools for local development workflows
- Extensible plugin architecture

## Architecture Evaluation Framework

VALHALLA evaluates architectures across eight critical dimensions:

1. **Frontend & UI** - Component architecture, state management, routing, user experience patterns
2. **Backend Services** - API design, service architecture, authentication, data validation
3. **Data Management** - Database design, caching strategies, data flow, persistence patterns
4. **DevOps & CI/CD** - Build pipelines, testing strategies, deployment automation, release management
5. **Infrastructure** - Cloud architecture, containerization, orchestration, scalability planning
6. **Observability** - Monitoring, logging, metrics, alerting, distributed tracing
7. **Security & Compliance** - Authentication, authorization, data protection, regulatory compliance
8. **ML & Data Services** - Model deployment, data pipelines, inference optimization, monitoring

## API Integration

### Evaluation Endpoint
```bash
POST /api/evaluate
Content-Type: application/json

{
  "architecture": "Detailed architecture description...",
  "options": {
    "includeGaps": true,
    "generateSuggestions": true
  }
}
```

### Generation Endpoint
```bash
POST /api/generate
Content-Type: application/json

{
  "concept": "E-commerce platform with microservices",
  "constraints": {
    "targetScore": 90,
    "industry": "retail"
  }
}
```

### Health Check
```bash
GET /health
GET /health/matrix
```

## LLM Provider Support

VALHALLA integrates with leading language model providers through user-supplied API keys:

- **OpenAI GPT-4** - Advanced reasoning and technical analysis
- **Anthropic Claude** - Detailed architectural planning and safety analysis  
- **Google Gemini** - Multi-modal analysis and pattern recognition

The platform applies sophisticated constraint mechanisms to ensure LLM outputs meet production architecture standards while maintaining consistency across different providers.

## Packages

- **[@valhalla/cli](packages/valhalla-cli)** - Command line interface for local development
- **[valhalla-api](packages/valhalla-api)** - REST API service with constraint engine
- **[valhalla-action](packages/valhalla-action)** - GitHub Action for CI/CD integration

## Security & IP Protection

VALHALLA implements enterprise-grade security measures:

- **Encrypted Evaluation Matrices** - Proprietary scoring algorithms protected via AES-256 encryption
- **Secure Key Management** - Environment-based secret management with rotation capabilities
- **Zero-Trust Architecture** - No proprietary data exposed in public repositories
- **Memory-Only Processing** - Sensitive evaluation criteria decrypted in memory only

## GitHub Actions Integration

```yaml
name: Architecture Review
on: [pull_request]

jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: R3DK3LL/valhalla-action@v1
        with:
          api-key: ${{ secrets.VALHALLA_API_KEY }}
          target-score: 85
          fail-below: 70
```

## Development Setup

```bash
# Clone repository
git clone https://github.com/R3DK3LL/Valhalla-validator.git
cd Valhalla-validator

# Install dependencies
npm install

# Build all packages
npm run build

# Start development API server
npm run dev:api

# Run CLI locally
npm run dev:cli evaluate ./examples/sample-architecture.md
```

## API Configuration

Set environment variables for LLM provider integration:

```bash
# Required for generation features
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key  
GOOGLE_API_KEY=your_google_key

# System configuration
NODE_ENV=production
PORT=3000
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/enhancement`)
3. Commit changes (`git commit -am 'Add new evaluation capability'`)
4. Push to branch (`git push origin feature/enhancement`)
5. Create Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **API Documentation**: [https://valhalla-api.onrender.com/docs](https://valhalla-api.onrender.com/docs)
- **Issues**: [GitHub Issues](https://github.com/R3DK3LL/Valhalla-validator/issues)
- **Community**: [Discussions](https://github.com/R3DK3LL/Valhalla-validator/discussions)

---

Built with precision engineering by [R3DK3LL](https://github.com/R3DK3LL)