# System Design Platform Backend - Complete Implementation

## 🎯 Project Overview

This backend implementation provides a **complete, production-ready RESTful API** for a system design learning platform similar to LeetCode. The system allows users to practice system design problems, submit solutions, collaborate in real-time, and compete on a leaderboard.

## ✅ Requirements Checklist

All 10 requirements from the problem statement have been successfully implemented:

- [x] **RESTful API** using Node.js and Express.js
- [x] **PostgreSQL database** with structured data tables
- [x] **JWT authentication** for secure user access
- [x] **Full CRUD operations** for Problems, Users, and Submissions
- [x] **Leaderboard generation** based on user scores
- [x] **Real-time WebSocket server** using Socket.IO for collaboration
- [x] **S3 file upload** endpoint for storing assets
- [x] **Error handling** with proper JSON formatting
- [x] **API documentation** using Swagger/OpenAPI
- [x] **Environment configuration** for managing sensitive data

## 📊 Database Schema

### Tables Implemented

1. **Users** (id, username, email, password, created_at, updated_at)
   - Unique constraints on username and email
   - Password hashing with bcryptjs
   - Timestamps for auditing

2. **Problems** (id, title, description, difficulty, tags, created_at, updated_at)
   - Difficulty enum: Easy/Medium/Hard
   - Array support for tags
   - Full-text description storage

3. **Submissions** (id, user_id, problem_id, solution, score, created_at, updated_at)
   - Foreign keys to users and problems
   - Score validation (0-100 range)
   - Cascade delete on user/problem removal

4. **SystemDesignDiagrams** (id, user_id, problem_id, diagram_data, name, created_at, updated_at)
   - JSONB storage for diagram data
   - Optional problem association
   - User ownership tracking

### Performance Optimizations
- Indexes on user_id and problem_id in submissions
- Indexes on user_id in diagrams
- Connection pooling for database efficiency

## 🔐 Security Features

### Authentication & Authorization
- ✅ JWT token-based authentication
- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ Email format validation
- ✅ Password strength requirements (minimum 8 characters)
- ✅ Token expiration (configurable, default 7 days)
- ✅ Authorization checks (users can only modify their own resources)

### API Security
- ✅ Rate limiting on all API routes (100 req/15 min)
- ✅ Stricter rate limiting on auth endpoints (5 req/15 min)
- ✅ Upload rate limiting (10 uploads/hour)
- ✅ CORS protection with configurable origin
- ✅ SQL injection prevention (parameterized queries)
- ✅ File upload validation (type and size limits)
- ✅ Input validation on all endpoints

### Security Scan Results
- ✅ Zero npm vulnerabilities
- ✅ CodeQL analysis passed
- ✅ AWS SDK v3 (no deprecated ACL usage)
- ✅ Race condition handling in user registration

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (authenticated)

### Users
- `GET /api/users` - Get all users (authenticated)
- `GET /api/users/:id` - Get user by ID (authenticated)
- `PUT /api/users/:id` - Update user (owner only)
- `DELETE /api/users/:id` - Delete user (owner only)

### Problems
- `POST /api/problems` - Create problem (authenticated)
- `GET /api/problems` - Get all problems (public, with filters)
- `GET /api/problems/:id` - Get problem by ID (public)
- `PUT /api/problems/:id` - Update problem (authenticated)
- `DELETE /api/problems/:id` - Delete problem (authenticated)

### Submissions
- `POST /api/submissions` - Create submission (authenticated)
- `GET /api/submissions` - Get all submissions (authenticated)
- `GET /api/submissions/:id` - Get submission by ID (authenticated)
- `GET /api/submissions/user/:userId` - Get user's submissions (authenticated)
- `GET /api/submissions/problem/:problemId` - Get problem submissions (authenticated)
- `PUT /api/submissions/:id` - Update submission (owner only)
- `DELETE /api/submissions/:id` - Delete submission (owner only)

### Leaderboard
- `GET /api/leaderboard` - Get top users by score (public)

### Diagrams
- `POST /api/diagrams` - Create diagram (authenticated)
- `GET /api/diagrams` - Get all diagrams (authenticated)
- `GET /api/diagrams/:id` - Get diagram by ID (authenticated)
- `GET /api/diagrams/user/:userId` - Get user's diagrams (authenticated)
- `PUT /api/diagrams/:id` - Update diagram (owner only)
- `DELETE /api/diagrams/:id` - Delete diagram (owner only)

### File Upload
- `POST /api/upload` - Upload file to S3 (authenticated, rate limited)
- `DELETE /api/upload/:key` - Delete file from S3 (authenticated)

### System
- `GET /health` - Health check endpoint
- `GET /api-docs` - Interactive Swagger documentation

## 🔄 Real-time Collaboration (WebSocket)

### Socket.IO Events

**Client → Server:**
- `join-diagram` - Join a diagram collaboration room
- `leave-diagram` - Leave a diagram collaboration room
- `diagram-update` - Broadcast diagram changes to room
- `cursor-move` - Share cursor position with room

**Server → Client:**
- `user-joined` - Notification when user joins room
- `user-left` - Notification when user leaves room
- `diagram-changed` - Receive diagram updates from others
- `cursor-update` - Receive cursor positions from others

### Features
- Room-based collaboration (isolated by diagram ID)
- Active user tracking per room
- Automatic cleanup on disconnect
- Real-time synchronization

## 📁 File Upload (AWS S3)

### Configuration
- AWS SDK v3 (latest, no vulnerabilities)
- Multipart upload support
- Configurable bucket and region
- No deprecated ACL usage (bucket policy based)

### Validation
- File type validation: JPEG, JPG, PNG, GIF, PDF, SVG, JSON
- File size limit: 5MB
- Memory storage (no disk I/O)
- Rate limiting: 10 uploads per hour per IP

### Response
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://bucket.s3.region.amazonaws.com/folder/file.ext",
    "key": "folder/file.ext",
    "bucket": "bucket-name"
  }
}
```

## 📚 Documentation

### Available Documentation
1. **README.md** - Complete setup and deployment guide
2. **QUICKSTART.md** - Quick start guide for developers
3. **API_TESTING_GUIDE.md** - API testing examples and Postman collection
4. **IMPLEMENTATION_SUMMARY.md** - Technical implementation details
5. **Swagger UI** - Interactive API documentation at `/api-docs`

### Setup Scripts
- **setup.sh** - Automated setup script for Unix systems
- **npm run init-db** - Initialize database tables
- **npm run seed-db** - Seed sample data for testing

## 🏗️ Architecture

### MVC Pattern

```
backend/
├── config/              # Configuration
│   ├── database.js      # DB connection pool
│   ├── initDatabase.js  # Table creation
│   └── seedDatabase.js  # Sample data
├── controllers/         # Business Logic
│   ├── authController.js
│   ├── userController.js
│   ├── problemController.js
│   ├── submissionController.js
│   ├── diagramController.js
│   └── uploadController.js
├── middleware/          # Middleware
│   ├── auth.js          # JWT authentication
│   ├── errorHandler.js  # Error handling
│   └── rateLimiter.js   # Rate limiting
├── models/              # Data Access
│   ├── User.js
│   ├── Problem.js
│   ├── Submission.js
│   └── Diagram.js
├── routes/              # API Routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── problemRoutes.js
│   ├── submissionRoutes.js
│   ├── diagramRoutes.js
│   └── uploadRoutes.js
└── server.js            # Application Entry
```

### Design Principles
- ✅ Separation of concerns
- ✅ Single responsibility
- ✅ DRY (Don't Repeat Yourself)
- ✅ Clean code practices
- ✅ Scalable architecture

## 🔧 Technologies Used

### Core
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Socket.IO** - Real-time communication

### Security
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-rate-limit** - Rate limiting
- **cors** - CORS protection

### Cloud & Storage
- **@aws-sdk/client-s3** - AWS S3 integration
- **@aws-sdk/lib-storage** - Multipart uploads
- **multer** - File upload handling

### Documentation
- **swagger-ui-express** - API documentation UI
- **swagger-jsdoc** - OpenAPI specification
- **morgan** - HTTP request logging

### Utilities
- **dotenv** - Environment configuration
- **pg** - PostgreSQL client
- **express-validator** - Input validation

## 🚀 Getting Started

### Quick Setup (3 Steps)

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Initialize Database**
   ```bash
   npm run init-db
   npm run seed-db  # Optional: add sample data
   ```

4. **Start Server**
   ```bash
   npm run dev  # Development mode
   # or
   npm start    # Production mode
   ```

5. **Access Documentation**
   ```
   http://localhost:5000/api-docs
   ```

## 📊 Sample Data

### Seeded Content
- **5 Users** - With username/email/password
- **8 Problems** - Various difficulties and topics
- **10 Submissions** - With scores
- **2 Diagrams** - Sample diagram data

### Test Credentials
- Email: `john@example.com`
- Password: `password123`

## 🔍 Error Handling

### Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## 📈 Performance

### Optimizations
- Database connection pooling
- Indexed queries for submissions and diagrams
- Pagination support (limit/offset)
- Efficient JOIN queries
- Memory-based file uploads (no disk I/O)

### Scalability
- Stateless authentication (JWT)
- Horizontal scaling ready
- External file storage (S3)
- Room-based WebSocket isolation

## 🧪 Testing

### Manual Testing
- Swagger UI for interactive testing
- Postman collection included
- cURL examples in documentation
- Health check endpoint

### Validation
- ✅ Server startup verified
- ✅ All routes accessible
- ✅ Authentication working
- ✅ Authorization enforced
- ✅ Rate limiting functional
- ✅ Error handling tested

## 🌐 Deployment Considerations

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Configure production database
- [ ] Set up AWS S3 bucket with policies
- [ ] Configure `CORS_ORIGIN` for frontend
- [ ] Enable HTTPS
- [ ] Set up process manager (PM2)
- [ ] Configure monitoring/logging
- [ ] Enable database backups

### Environment Variables
```env
PORT=5000
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=systemdesign_db
JWT_SECRET=your-secure-secret-key
JWT_EXPIRE=7d
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket
CORS_ORIGIN=https://yourdomain.com
```

## 📝 API Response Examples

### Register User
```bash
POST /api/auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "created_at": "2024-01-28T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Leaderboard
```bash
GET /api/leaderboard?limit=10
```

Response:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 2,
      "username": "jane_smith",
      "email": "jane@example.com",
      "problems_solved": 3,
      "average_score": 88.33,
      "total_score": 265,
      "last_submission": "2024-01-28T10:30:00.000Z"
    }
  ]
}
```

## 🎓 Learning Resources

### Understanding the Code
1. Start with `server.js` - Application entry point
2. Review `routes/` - Understand API structure
3. Explore `controllers/` - Business logic
4. Study `models/` - Data access patterns
5. Check `middleware/` - Cross-cutting concerns

### Key Concepts
- RESTful API design
- JWT authentication flow
- MVC architecture
- Database relationships
- Real-time communication
- Cloud storage integration

## 🤝 Contributing

### Code Standards
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code structure
- Validate inputs
- Handle errors properly
- Update documentation

## 📄 License

MIT License - Feel free to use for learning and projects

## 🎉 Summary

This backend implementation is:
- ✅ **Complete** - All requirements met
- ✅ **Secure** - Multiple security layers
- ✅ **Scalable** - Ready for growth
- ✅ **Documented** - Comprehensive guides
- ✅ **Production-Ready** - Tested and validated

Perfect for a LeetCode-style system design learning platform! 🚀
