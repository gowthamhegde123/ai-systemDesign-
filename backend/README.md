# System Design Platform - Backend API

A comprehensive RESTful API backend for a system design platform similar to LeetCode, built with Node.js, Express.js, and PostgreSQL.

## Features

- 🔐 **JWT Authentication** - Secure user authentication with JSON Web Tokens
- 📊 **PostgreSQL Database** - Robust relational database with proper schema design
- 🎯 **RESTful API** - Full CRUD operations for all resources
- 🏆 **Leaderboard System** - Track user scores and rankings
- 🔄 **Real-time Collaboration** - Socket.IO for live diagram collaboration
- 📁 **File Upload** - S3-compatible storage for assets
- 📚 **API Documentation** - Interactive Swagger/OpenAPI documentation
- ⚡ **Error Handling** - Comprehensive error handling and validation
- 🔒 **Security** - Password hashing, JWT tokens, and CORS protection

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Real-time**: Socket.IO
- **File Storage**: AWS S3
- **Documentation**: Swagger UI
- **Validation**: express-validator
- **Security**: bcryptjs, CORS

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- AWS Account (for S3 file uploads)

## Installation

### 1. Navigate to the backend directory

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=systemdesign_db

# JWT Configuration
JWT_SECRET=your_secret_key_here_make_it_long_and_secure
JWT_EXPIRE=7d

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 4. Set up PostgreSQL database

Create a new PostgreSQL database:

```sql
CREATE DATABASE systemdesign_db;
```

### 5. Initialize database tables

Run the database initialization script:

```bash
npm run init-db
```

This will create all required tables:
- `users` - User accounts
- `problems` - System design problems
- `submissions` - User submissions
- `system_design_diagrams` - Diagram data

## Running the Server

### Development mode (with auto-reload)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## API Documentation

Once the server is running, visit:

**Swagger UI**: `http://localhost:5000/api-docs`

This provides an interactive interface to explore and test all API endpoints.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires authentication)

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Problems

- `POST /api/problems` - Create a new problem
- `GET /api/problems` - Get all problems (supports filtering by difficulty and tags)
- `GET /api/problems/:id` - Get problem by ID
- `PUT /api/problems/:id` - Update problem
- `DELETE /api/problems/:id` - Delete problem

### Submissions

- `POST /api/submissions` - Create a new submission
- `GET /api/submissions` - Get all submissions
- `GET /api/submissions/:id` - Get submission by ID
- `GET /api/submissions/user/:userId` - Get submissions by user
- `GET /api/submissions/problem/:problemId` - Get submissions by problem
- `PUT /api/submissions/:id` - Update submission
- `DELETE /api/submissions/:id` - Delete submission

### Leaderboard

- `GET /api/leaderboard` - Get leaderboard (top users by score)

### Diagrams

- `POST /api/diagrams` - Create a new diagram
- `GET /api/diagrams` - Get all diagrams
- `GET /api/diagrams/:id` - Get diagram by ID
- `GET /api/diagrams/user/:userId` - Get diagrams by user
- `PUT /api/diagrams/:id` - Update diagram
- `DELETE /api/diagrams/:id` - Delete diagram

### File Upload

- `POST /api/upload` - Upload file to S3 (multipart/form-data)
- `DELETE /api/upload/:key` - Delete file from S3

### Health Check

- `GET /health` - Server health check

## WebSocket Events (Socket.IO)

### Client to Server Events

- `join-diagram` - Join a diagram collaboration room
  ```javascript
  socket.emit('join-diagram', { diagramId, userId });
  ```

- `leave-diagram` - Leave a diagram collaboration room
  ```javascript
  socket.emit('leave-diagram', { diagramId, userId });
  ```

- `diagram-update` - Send diagram updates to other users
  ```javascript
  socket.emit('diagram-update', { diagramId, data, userId });
  ```

- `cursor-move` - Send cursor position updates
  ```javascript
  socket.emit('cursor-move', { diagramId, userId, position });
  ```

### Server to Client Events

- `user-joined` - Notifies when a user joins the room
- `user-left` - Notifies when a user leaves the room
- `diagram-changed` - Receives diagram updates from other users
- `cursor-update` - Receives cursor position from other users

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Database Schema

### Users Table
```sql
- id (SERIAL PRIMARY KEY)
- username (VARCHAR UNIQUE)
- email (VARCHAR UNIQUE)
- password (VARCHAR - hashed)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Problems Table
```sql
- id (SERIAL PRIMARY KEY)
- title (VARCHAR)
- description (TEXT)
- difficulty (VARCHAR - Easy/Medium/Hard)
- tags (TEXT[])
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Submissions Table
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FOREIGN KEY)
- problem_id (INTEGER FOREIGN KEY)
- solution (TEXT)
- score (INTEGER 0-100)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### System Design Diagrams Table
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FOREIGN KEY)
- problem_id (INTEGER FOREIGN KEY - nullable)
- diagram_data (JSONB)
- name (VARCHAR - nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Project Structure

```
backend/
├── config/
│   ├── database.js          # Database connection configuration
│   └── initDatabase.js      # Database initialization script
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User CRUD operations
│   ├── problemController.js # Problem CRUD operations
│   ├── submissionController.js # Submission CRUD + Leaderboard
│   ├── diagramController.js # Diagram CRUD operations
│   └── uploadController.js  # File upload logic
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── errorHandler.js      # Global error handling
├── models/
│   ├── User.js              # User model
│   ├── Problem.js           # Problem model
│   ├── Submission.js        # Submission model
│   └── Diagram.js           # Diagram model
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── userRoutes.js        # User routes
│   ├── problemRoutes.js     # Problem routes
│   ├── submissionRoutes.js  # Submission routes
│   ├── diagramRoutes.js     # Diagram routes
│   └── uploadRoutes.js      # Upload routes
├── uploads/                 # Temporary upload directory
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
├── server.js                # Main server file
└── README.md               # This file
```

## Error Handling

All errors are handled centrally and return JSON responses in the following format:

```json
{
  "success": false,
  "message": "Error message here",
  "stack": "Stack trace (only in development)"
}
```

## Security Best Practices

- ✅ Passwords are hashed using bcryptjs
- ✅ JWT tokens for stateless authentication
- ✅ CORS protection
- ✅ Input validation and sanitization
- ✅ SQL injection protection (parameterized queries)
- ✅ Environment variables for sensitive data
- ✅ File upload validation and size limits

## Testing the API

### Using cURL

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get all problems (no auth required)
curl http://localhost:5000/api/problems
```

### Using the Swagger UI

Navigate to `http://localhost:5000/api-docs` for an interactive API testing interface.

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Verify database credentials in `.env`
- Check if the database exists

### JWT Token Issues

- Ensure `JWT_SECRET` is set in `.env`
- Token might be expired (check `JWT_EXPIRE` setting)

### S3 Upload Issues

- Verify AWS credentials are correct
- Check bucket permissions
- Ensure bucket exists in the specified region

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
