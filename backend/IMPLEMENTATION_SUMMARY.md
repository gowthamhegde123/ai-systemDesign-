# Backend Implementation Summary

## Overview

This document provides a comprehensive overview of the backend implementation for the System Design Platform, a LeetCode-style platform for practicing system design problems.

## Architecture

The backend follows a clean **MVC (Model-View-Controller)** architecture with the following structure:

```
backend/
├── config/              # Configuration files
│   ├── database.js      # PostgreSQL connection pool
│   └── initDatabase.js  # Database initialization script
├── controllers/         # Business logic
│   ├── authController.js
│   ├── userController.js
│   ├── problemController.js
│   ├── submissionController.js
│   ├── diagramController.js
│   └── uploadController.js
├── middleware/          # Express middleware
│   ├── auth.js          # JWT authentication
│   └── errorHandler.js  # Global error handling
├── models/              # Data models
│   ├── User.js
│   ├── Problem.js
│   ├── Submission.js
│   └── Diagram.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── problemRoutes.js
│   ├── submissionRoutes.js
│   ├── diagramRoutes.js
│   └── uploadRoutes.js
├── uploads/             # Temporary upload directory
└── server.js            # Main application entry point
```

## Key Features Implemented

### 1. RESTful API with Express.js ✅
- Clean REST architecture
- Proper HTTP methods (GET, POST, PUT, DELETE)
- Consistent JSON response format
- Request/response logging with Morgan

### 2. PostgreSQL Database ✅
Four main tables implemented:

**Users Table**
- Primary key: `id` (SERIAL)
- Unique fields: `username`, `email`
- Password hashing with bcryptjs
- Timestamps: `created_at`, `updated_at`

**Problems Table**
- Primary key: `id` (SERIAL)
- Fields: `title`, `description`, `difficulty`, `tags`
- Difficulty constraint: Easy/Medium/Hard
- Array support for tags

**Submissions Table**
- Primary key: `id` (SERIAL)
- Foreign keys: `user_id`, `problem_id`
- Score validation: 0-100 range
- Cascade delete on user/problem deletion

**SystemDesignDiagrams Table**
- Primary key: `id` (SERIAL)
- Foreign keys: `user_id`, `problem_id` (nullable)
- JSONB storage for diagram data
- Optional name field

### 3. JWT Authentication ✅
- Secure token generation
- Token expiration (configurable)
- Bearer token authentication
- Protected routes
- Password hashing with bcryptjs (10 rounds)

### 4. Full CRUD Operations ✅

**Users**
- Create (via register)
- Read (all, by ID)
- Update (own profile)
- Delete (own account)

**Problems**
- Create (authenticated)
- Read (all with filters, by ID)
- Update (authenticated)
- Delete (authenticated)
- Filter by difficulty and tags

**Submissions**
- Create (authenticated)
- Read (all, by ID, by user, by problem)
- Update (authenticated)
- Delete (authenticated)

**Diagrams**
- Create (authenticated)
- Read (all, by ID, by user)
- Update (authenticated)
- Delete (authenticated)

### 5. Leaderboard System ✅
Endpoint: `GET /api/leaderboard`

Aggregates data showing:
- User ranking by total score
- Problems solved count
- Average score
- Last submission timestamp
- Configurable limit (default: 10)

### 6. Real-time Collaboration with Socket.IO ✅

**Events Implemented:**

Client → Server:
- `join-diagram` - Join collaboration room
- `leave-diagram` - Leave collaboration room
- `diagram-update` - Sync diagram changes
- `cursor-move` - Share cursor position

Server → Client:
- `user-joined` - User joined notification
- `user-left` - User left notification
- `diagram-changed` - Diagram update broadcast
- `cursor-update` - Cursor position update

**Features:**
- Room-based collaboration
- Active user tracking
- Real-time synchronization
- Automatic cleanup on disconnect

### 7. File Upload to S3 ✅
- AWS SDK v3 implementation
- Multipart file upload support
- File type validation (images, PDF, SVG, JSON)
- Size limit: 5MB
- Configurable folder structure
- Public read access
- File deletion support

**Supported File Types:**
- Images: JPEG, JPG, PNG, GIF
- Documents: PDF
- Graphics: SVG
- Data: JSON

### 8. Error Handling & Validation ✅

**Global Error Handler:**
- Centralized error processing
- Consistent error format
- Environment-aware (dev/prod)
- Stack traces in development
- PostgreSQL error mapping

**Validation:**
- Input validation in controllers
- Type checking
- Constraint enforcement
- Foreign key validation

**Error Types Handled:**
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Database errors (mapped to 400)
- Server errors (500)

### 9. API Documentation with Swagger ✅

**Features:**
- OpenAPI 3.0 specification
- Interactive Swagger UI
- Available at `/api-docs`
- Complete endpoint documentation
- Request/response examples
- Authentication schema defined

**Documented Endpoints:**
- All authentication endpoints
- All user endpoints
- All problem endpoints
- All submission endpoints
- All diagram endpoints
- File upload endpoints
- Leaderboard endpoint

### 10. Environment Configuration ✅

**Environment Variables:**
```
Server:
- PORT
- NODE_ENV

Database:
- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME

JWT:
- JWT_SECRET
- JWT_EXPIRE

AWS S3:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION
- AWS_S3_BUCKET

CORS:
- CORS_ORIGIN
```

## Security Features

1. **Password Security**
   - bcryptjs hashing (10 rounds)
   - Passwords never stored in plain text
   - Passwords excluded from API responses

2. **JWT Security**
   - Signed tokens
   - Expiration enforcement
   - Secure secret key

3. **CORS Protection**
   - Configurable origin
   - Preflight handling

4. **Input Validation**
   - Type checking
   - Range validation
   - SQL injection prevention (parameterized queries)

5. **File Upload Security**
   - File type validation
   - Size limits
   - Memory storage (no disk access)

6. **Database Security**
   - Parameterized queries
   - Connection pooling
   - Cascade delete protection

## API Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... },
  "count": 10  // For list endpoints
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "stack": "..."  // Only in development
}
```

## Database Relationships

```
Users
  ├─> Submissions (one-to-many)
  └─> SystemDesignDiagrams (one-to-many)

Problems
  ├─> Submissions (one-to-many)
  └─> SystemDesignDiagrams (one-to-many, nullable)
```

**Cascade Behavior:**
- Deleting a user → deletes all their submissions and diagrams
- Deleting a problem → deletes all related submissions, sets diagram.problem_id to NULL

## Performance Considerations

1. **Database Indexes**
   - Index on `submissions.user_id`
   - Index on `submissions.problem_id`
   - Index on `system_design_diagrams.user_id`

2. **Connection Pooling**
   - PostgreSQL connection pool
   - Automatic connection management

3. **Pagination**
   - Limit/offset support on list endpoints
   - Default limits to prevent overload

4. **Query Optimization**
   - JOINs for related data
   - Selective field retrieval
   - Efficient aggregations

## Scalability Features

1. **Stateless Authentication**
   - JWT tokens (no server-side sessions)
   - Horizontal scaling ready

2. **Database Design**
   - Normalized schema
   - Proper relationships
   - Index optimization

3. **File Storage**
   - External S3 storage
   - No server disk usage

4. **WebSocket Rooms**
   - Isolated collaboration spaces
   - Automatic cleanup

## Testing

The backend can be tested using:

1. **Swagger UI** - Interactive testing at `/api-docs`
2. **Postman** - Collection provided in API_TESTING_GUIDE.md
3. **cURL** - Command-line examples in README.md
4. **Manual** - Direct HTTP requests

## Dependencies

**Production:**
- `express` - Web framework
- `pg` - PostgreSQL client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT handling
- `dotenv` - Environment configuration
- `cors` - CORS middleware
- `multer` - File upload handling
- `@aws-sdk/client-s3` - AWS S3 (v3)
- `@aws-sdk/lib-storage` - S3 multipart upload
- `socket.io` - Real-time communication
- `express-validator` - Input validation
- `swagger-ui-express` - API documentation
- `swagger-jsdoc` - Swagger spec generation
- `morgan` - HTTP request logger

**Development:**
- `nodemon` - Auto-restart on changes

## Deployment Considerations

1. **Environment Setup**
   - Configure all environment variables
   - Ensure PostgreSQL is accessible
   - Set up AWS S3 bucket

2. **Database Initialization**
   - Run `npm run init-db` once
   - Or manually execute SQL from initDatabase.js

3. **Production Mode**
   - Set `NODE_ENV=production`
   - Use strong JWT_SECRET
   - Configure proper CORS_ORIGIN

4. **Process Management**
   - Use PM2 or similar for production
   - Enable clustering for multi-core
   - Configure automatic restarts

## Future Enhancements

Potential improvements:
1. Add user roles (admin, user)
2. Implement rate limiting
3. Add Redis caching
4. Email verification
5. Password reset flow
6. Search functionality
7. Pagination metadata
8. API versioning
9. Request throttling
10. Comprehensive test suite

## Conclusion

This backend implementation provides a complete, production-ready API for a system design platform. It follows best practices for:
- Code organization (MVC)
- Security (JWT, bcrypt, validation)
- Scalability (stateless, pooling)
- Documentation (Swagger)
- Error handling (centralized)
- Real-time features (Socket.IO)
- Cloud integration (S3)

The system is ready for deployment and can handle the requirements of a LeetCode-style platform for system design practice.
