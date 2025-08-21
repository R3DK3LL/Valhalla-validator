# VALHALLA Render Deployment Guide

## Overview
VALHALLA API is configured for deployment on Render.com as a persistent web service.

## Deployment Steps

### 1. Connect Repository
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `R3DK3LL/Valhalla-validator`
4. Select the repository and branch `main`

### 2. Configure Service
- **Name**: `valhalla-api`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `packages/valhalla-api`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 3. Environment Variables
Set these in Render dashboard:

```
NODE_ENV=production
PORT=10000
VALHALLA_MATRIX_KEY=your-256-bit-encryption-key
ALLOWED_ORIGINS=https://yourdomain.com
```

### 4. Advanced Settings
- **Auto-Deploy**: Yes
- **Health Check Path**: `/health`
- **Plan**: Starter ($7/month) or higher

## Local Development

```bash
cd packages/valhalla-api
npm install
npm run dev  # Starts with nodemon
```

## Testing Deployment

```bash
curl https://your-app.onrender.com/health
```

Should return:
```json
{
  "status": "healthy",
  "service": "valhalla-api",
  "version": "1.0.0"
}
```

## Environment Variables

### Required
- `VALHALLA_MATRIX_KEY`: 256-bit encryption key for matrix decryption
- `NODE_ENV`: Set to "production"

### Optional
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins
- `PORT`: Port number (Render sets this automatically)
