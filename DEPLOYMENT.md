# Deployment Guide

Complete guide for deploying the AI System Design Learning Platform to production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [ML Validator Deployment](#ml-validator-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Monitoring & Logging](#monitoring--logging)
8. [Scaling](#scaling)

## Prerequisites

### Required Services
- **Database**: PostgreSQL 14+ (recommended: AWS RDS, Supabase, or Railway)
- **Redis**: Redis 6+ (recommended: Redis Cloud, AWS ElastiCache, or Upstash)
- **Object Storage**: S3-compatible storage (AWS S3, Cloudflare R2, or Backblaze B2)
- **Container Registry**: Docker Hub, AWS ECR, or GitHub Container Registry

### Required Accounts
- GitHub (for code hosting and CI/CD)
- Vercel (for frontend hosting)
- Railway/Render (for backend hosting)
- AWS/GCP (for ML service hosting)

## Database Setup

### 1. Create PostgreSQL Database

**Option A: Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Add PostgreSQL
railway add postgresql

# Get connection string
railway variables
```

**Option B: Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings > Database

### 2. Setup Redis

**Using Upstash (Free tier available)**
```bash
# Go to https://upstash.com
# Create new Redis database
# Copy REDIS_URL
```

### 3. Run Migrations

```bash
cd backend

# Set DATABASE_URL
export DATABASE_URL="postgresql://user:password@host:5432/database"

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

## Backend Deployment

### Option 1: Railway

```bash
cd backend

# Login to Railway
railway login

# Link to project
railway link

# Set environment variables
railway variables set NODE_ENV=production
railway variables set DATABASE_URL=<your-database-url>
railway variables set REDIS_URL=<your-redis-url>
railway variables set JWT_SECRET=<generate-secret>
railway variables set AWS_ACCESS_KEY_ID=<your-key>
railway variables set AWS_SECRET_ACCESS_KEY=<your-secret>
railway variables set AWS_S3_BUCKET=<your-bucket>

# Deploy
railway up
```

### Option 2: Render

1. **Create `render.yaml`** (already included in project)

2. **Push to GitHub**
```bash
git push origin main
```

3. **Connect to Render**
- Go to [render.com](https://render.com)
- New > Web Service
- Connect GitHub repository
- Render will auto-deploy using render.yaml

### Option 3: Docker + AWS ECS

```bash
cd backend

# Build Docker image
docker build -t ai-design-backend .

# Tag for ECR
docker tag ai-design-backend:latest <your-ecr-repo>:latest

# Push to ECR
docker push <your-ecr-repo>:latest

# Deploy to ECS (use AWS Console or CLI)
```

## Frontend Deployment

### Deploy to Vercel (Recommended)

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_API_URL
# - NEXT_PUBLIC_ML_API_URL

# Deploy to production
vercel --prod
```

### Manual Build

```bash
cd frontend

# Install dependencies
npm install

# Build
npm run build

# Outputs to .next/ directory
# Deploy to any static host (Netlify, Cloudflare Pages, etc.)
```

## ML Validator Deployment

### Option 1: Google Cloud Run

```bash
cd ml-validator

# Build Docker image
docker build -t ai-design-ml-validator .

# Tag for GCR
docker tag ai-design-ml-validator gcr.io/<project-id>/ml-validator

# Push to GCR
docker push gcr.io/<project-id>/ml-validator

# Deploy to Cloud Run
gcloud run deploy ml-validator \
  --image gcr.io/<project-id>/ml-validator \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2
```

### Option 2: AWS Lambda + API Gateway

```bash
# Package Lambda function
cd ml-validator
zip -r function.zip .

# Upload to Lambda (use AWS Console or CLI)
# Set runtime: Python 3.9
# Set handler: main.handler
# Set memory: 2048 MB
# Set timeout: 30 seconds

# Create API Gateway
# Connect to Lambda function
```

### Option 3: Kubernetes

```yaml
# k8s/ml-validator-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-validator
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ml-validator
  template:
    metadata:
      labels:
        app: ml-validator
    spec:
      containers:
      - name: ml-validator
        image: your-registry/ml-validator:latest
        ports:
        - containerPort: 8000
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        env:
        - name: ENV
          value: "production"
---
apiVersion: v1
kind: Service
metadata:
  name: ml-validator-service
spec:
  selector:
    app: ml-validator
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

## Environment Configuration

### Backend (.env)
```bash
# Server
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://your-frontend-domain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Redis
REDIS_URL=redis://default:password@host:6379

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1

# ML Service
ML_API_URL=https://your-ml-service-url.com
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_ML_API_URL=https://your-ml-service-url.com
```

### ML Validator (.env)
```bash
ENV=production
LOG_LEVEL=info
```

## Monitoring & Logging

### 1. Setup Application Monitoring

**Using DataDog**
```bash
# Backend
npm install dd-trace

# Add to src/index.ts
import tracer from 'dd-trace'
tracer.init()
```

**Using Sentry**
```bash
# Frontend
npm install @sentry/nextjs

# Backend
npm install @sentry/node

# Initialize in both apps
```

### 2. Setup Logging

**Backend (Winston)**
```typescript
// src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

export default logger;
```

### 3. Setup Metrics

**Using Prometheus + Grafana**
```bash
# Add to backend
npm install prom-client

# Create metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});
```

## Scaling

### Auto-scaling Configuration

**AWS Auto Scaling Group**
```json
{
  "minSize": 2,
  "maxSize": 10,
  "desiredCapacity": 2,
  "targetTrackingScalingPolicies": [
    {
      "targetValue": 70.0,
      "predefinedMetricType": "ASGAverageCPUUtilization"
    }
  ]
}
```

**Kubernetes HPA**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Database Scaling

**Read Replicas**
```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}

// Use read replicas
const readDB = new PrismaClient({ 
  datasources: { db: { url: REPLICA_URL } } 
});
```

**Connection Pooling**
```bash
DATABASE_URL="postgresql://user:password@host:5432/db?pgbouncer=true&connection_limit=10"
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Health Checks

### Backend
```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected', // Check DB connection
    redis: 'connected', // Check Redis connection
  });
});
```

### ML Validator
```python
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": True,
        "timestamp": datetime.now().isoformat()
    }
```

## Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Set secure headers (helmet.js)
- [ ] Enable CORS with specific origins
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable database SSL
- [ ] Implement input validation
- [ ] Setup WAF (Web Application Firewall)
- [ ] Enable audit logging
- [ ] Regular security updates

## Cost Optimization

1. **Use caching aggressively** - Reduce database queries
2. **Optimize images** - Use CDN and compressed formats
3. **Database connection pooling** - Reduce connection overhead
4. **Auto-scaling** - Scale down during low traffic
5. **Spot instances** - For batch jobs (ML training)
6. **Monitor usage** - Set up billing alerts

## Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Check connection string
echo $DATABASE_URL

# Test connection
npx prisma db pull

# Check firewall rules
```

**ML Service Timeout**
```bash
# Increase timeout in backend
axios.post(ML_API_URL, data, { timeout: 60000 })

# Increase Lambda timeout
# AWS Console > Lambda > Configuration > General > Timeout
```

**High Memory Usage**
```bash
# Monitor Node.js memory
node --max-old-space-size=4096 dist/index.js

# Monitor Python memory
# Add memory profiling in ML service
```

## Support

For issues or questions:
- GitHub Issues: [repository]/issues
- Documentation: [repository]/docs
- Email: support@your-domain.com

---

**Deployment Complete!** 🚀

Your AI System Design Learning Platform is now live!
