# API Testing Guide

This guide provides examples for testing the System Design Platform API endpoints.

## Quick Start

### 1. Register a New User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
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

### 2. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Create a Problem (Authenticated)

```http
POST /api/problems
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "title": "Design URL Shortener",
  "description": "Design a URL shortening service like bit.ly",
  "difficulty": "Medium",
  "tags": ["system-design", "databases", "distributed-systems"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Problem created successfully",
  "data": {
    "id": 1,
    "title": "Design URL Shortener",
    "description": "Design a URL shortening service like bit.ly",
    "difficulty": "Medium",
    "tags": ["system-design", "databases", "distributed-systems"],
    "created_at": "2024-01-28T10:05:00.000Z",
    "updated_at": "2024-01-28T10:05:00.000Z"
  }
}
```

### 4. Get All Problems (Public)

```http
GET /api/problems?difficulty=Medium&limit=10&offset=0
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "title": "Design URL Shortener",
      "description": "Design a URL shortening service like bit.ly",
      "difficulty": "Medium",
      "tags": ["system-design", "databases", "distributed-systems"],
      "created_at": "2024-01-28T10:05:00.000Z",
      "updated_at": "2024-01-28T10:05:00.000Z"
    }
  ]
}
```

### 5. Submit a Solution (Authenticated)

```http
POST /api/submissions
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "problem_id": 1,
  "solution": "My solution includes using a hash function to generate short codes...",
  "score": 85
}
```

**Response:**
```json
{
  "success": true,
  "message": "Submission created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "problem_id": 1,
    "solution": "My solution includes using a hash function to generate short codes...",
    "score": 85,
    "created_at": "2024-01-28T10:10:00.000Z",
    "updated_at": "2024-01-28T10:10:00.000Z"
  }
}
```

### 6. Get Leaderboard (Public)

```http
GET /api/leaderboard?limit=10
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "problems_solved": 1,
      "average_score": 85,
      "total_score": 85,
      "last_submission": "2024-01-28T10:10:00.000Z"
    }
  ]
}
```

### 7. Create a Diagram (Authenticated)

```http
POST /api/diagrams
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "diagram_data": {
    "nodes": [
      {"id": "1", "type": "loadBalancer", "position": {"x": 100, "y": 100}},
      {"id": "2", "type": "database", "position": {"x": 300, "y": 100}}
    ],
    "edges": [
      {"source": "1", "target": "2"}
    ]
  },
  "problem_id": 1,
  "name": "My URL Shortener Design"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Diagram created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "problem_id": 1,
    "diagram_data": {...},
    "name": "My URL Shortener Design",
    "created_at": "2024-01-28T10:15:00.000Z",
    "updated_at": "2024-01-28T10:15:00.000Z"
  }
}
```

### 8. Upload a File (Authenticated)

```http
POST /api/upload
Content-Type: multipart/form-data
Authorization: Bearer YOUR_TOKEN_HERE

file: [binary data]
folder: "diagrams"
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://your-bucket.s3.amazonaws.com/diagrams/1706437800000-diagram.png",
    "key": "diagrams/1706437800000-diagram.png",
    "bucket": "your-bucket-name"
  }
}
```

## WebSocket Testing

### Connect to Socket.IO

```javascript
const io = require('socket.io-client');
const socket = io('http://localhost:5000');

// Join a diagram room
socket.emit('join-diagram', {
  diagramId: '1',
  userId: '1'
});

// Listen for user joined
socket.on('user-joined', (data) => {
  console.log('User joined:', data);
});

// Send diagram updates
socket.emit('diagram-update', {
  diagramId: '1',
  data: { nodes: [...], edges: [...] },
  userId: '1'
});

// Listen for diagram changes
socket.on('diagram-changed', (data) => {
  console.log('Diagram changed:', data);
});
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Postman Collection

Import this JSON into Postman for quick testing:

```json
{
  "info": {
    "name": "System Design Platform API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000",
      "type": "string"
    },
    {
      "key": "token",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"testuser\",\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    }
  ]
}
```

## Tips

1. **Save the token**: After login, copy the JWT token and use it in the Authorization header for protected routes
2. **Use environment variables**: Set up Postman environment variables for `baseUrl` and `token`
3. **Check Swagger docs**: Visit `/api-docs` for interactive documentation
4. **Test in order**: Register → Login → Create resources
5. **Monitor logs**: Check server console for detailed request/response logs
