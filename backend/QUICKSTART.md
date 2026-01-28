# Quick Start Guide

This guide will help you get the System Design Platform backend up and running in minutes.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)

Optional:
- **AWS Account** (only if you want to test file uploads to S3)

## Installation Steps

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (~230 packages).

### Step 3: Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Minimal configuration to get started
PORT=5000
NODE_ENV=development

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=systemdesign_db

# JWT Secret (use a strong random string in production)
JWT_SECRET=your_secret_key_minimum_32_characters_long
JWT_EXPIRE=7d

# CORS (frontend URL)
CORS_ORIGIN=http://localhost:3000

# AWS S3 (optional - only needed for file uploads)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

**Important:** Replace `your_postgres_password` and `your_secret_key_minimum_32_characters_long` with actual values.

### Step 4: Create PostgreSQL Database

Open PostgreSQL command line (psql) and create the database:

```sql
CREATE DATABASE systemdesign_db;
```

Or using command line:

```bash
createdb systemdesign_db
```

### Step 5: Initialize Database Tables

Run the database initialization script to create all tables:

```bash
npm run init-db
```

You should see:
```
✓ Users table created
✓ Problems table created
✓ Submissions table created
✓ SystemDesignDiagrams table created
✓ Indexes created

✅ Database initialization completed successfully!
```

### Step 6 (Optional): Seed Sample Data

To populate the database with sample data for testing:

```bash
npm run seed-db
```

This will create:
- 5 sample users
- 8 sample problems
- 10 sample submissions
- 2 sample diagrams

Test credentials:
- Email: `john@example.com`
- Password: `password123`

### Step 7: Start the Server

For development (with auto-reload):

```bash
npm run dev
```

For production:

```bash
npm start
```

You should see:

```
╔════════════════════════════════════════════════════╗
║   System Design Platform API Server               ║
║   Server running on port 5000                      ║
║   Environment: development                         ║
║   API Documentation: http://localhost:5000/api-docs ║
╚════════════════════════════════════════════════════╝
```

## Verify Installation

### Test the Health Endpoint

Open your browser or use curl:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-28T10:00:00.000Z"
}
```

### Access API Documentation

Open your browser and navigate to:

```
http://localhost:5000/api-docs
```

You should see the interactive Swagger UI documentation.

## Test the API

### 1. Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Copy the `token` from the response.

### 3. Get All Problems (No Auth Required)

```bash
curl http://localhost:5000/api/problems
```

### 4. Create a Problem (Auth Required)

```bash
curl -X POST http://localhost:5000/api/problems \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Design YouTube",
    "description": "Design a video sharing platform",
    "difficulty": "Hard",
    "tags": ["video", "streaming", "cdn"]
  }'
```

Replace `YOUR_TOKEN_HERE` with the token from step 2.

## Using Swagger UI (Recommended)

The easiest way to test the API is through Swagger UI:

1. Go to `http://localhost:5000/api-docs`
2. Click on any endpoint to expand it
3. Click "Try it out"
4. Fill in the parameters
5. Click "Execute"

For authenticated endpoints:
1. Click the "Authorize" button at the top
2. Enter: `Bearer YOUR_TOKEN`
3. Click "Authorize"
4. Now all authenticated requests will include the token

## Troubleshooting

### Database Connection Failed

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:** 
- Ensure PostgreSQL is running
- Verify database credentials in `.env`
- Check if database exists: `psql -l | grep systemdesign_db`

### JWT Error

**Error:** `Error: secretOrPrivateKey must have a value`

**Solution:**
- Ensure `JWT_SECRET` is set in `.env`
- Make sure it's at least 32 characters long

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
- Change `PORT` in `.env` to a different value
- Or kill the process using port 5000:
  ```bash
  # Find process
  lsof -i :5000
  # Kill process
  kill -9 <PID>
  ```

### Module Not Found

**Error:** `Error: Cannot find module 'express'`

**Solution:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### AWS S3 Upload Fails

**Error:** `AccessDenied: Access Denied`

**Solution:**
- File uploads are optional - other features work without S3
- To use S3, configure valid AWS credentials
- Ensure bucket exists and has correct permissions
- Check bucket policy allows public-read ACL

## Next Steps

1. **Explore the API** - Use Swagger UI to test all endpoints
2. **Read the Documentation** - Check `README.md` for detailed information
3. **Review the Code** - Explore the MVC structure
4. **Test WebSockets** - See `API_TESTING_GUIDE.md` for Socket.IO examples
5. **Build a Frontend** - Connect your React/Vue/Angular app to this backend

## Quick Reference

### Important URLs
- API Base: `http://localhost:5000/api`
- Documentation: `http://localhost:5000/api-docs`
- Health Check: `http://localhost:5000/health`

### Useful Commands
```bash
# Start development server
npm run dev

# Initialize database
npm run init-db

# Seed sample data
npm run seed-db

# Start production server
npm start

# Check database tables
psql systemdesign_db -c "\dt"

# View database records
psql systemdesign_db -c "SELECT * FROM users;"
```

### Sample Test Flow
1. Register → Get token
2. Login → Verify token works
3. Create Problem → Test authenticated route
4. Submit Solution → Test submission
5. View Leaderboard → See rankings
6. Create Diagram → Test diagram storage

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the error logs in the console
3. Ensure all environment variables are set correctly
4. Verify PostgreSQL is running and accessible
5. Check that all dependencies are installed

## Architecture Overview

```
Frontend (Port 3000)
        ↓
Backend API (Port 5000)
        ↓
PostgreSQL Database
        +
AWS S3 (optional)
```

## Security Notes

- Never commit `.env` file to version control
- Use strong JWT secrets in production
- Enable HTTPS in production
- Set appropriate CORS origins
- Use environment-specific configurations
- Regularly update dependencies

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a strong, random `JWT_SECRET`
3. Set correct `CORS_ORIGIN`
4. Use a managed PostgreSQL service (AWS RDS, Heroku Postgres, etc.)
5. Set up proper logging
6. Use a process manager (PM2, systemd)
7. Enable HTTPS
8. Set up monitoring

Happy coding! 🚀
