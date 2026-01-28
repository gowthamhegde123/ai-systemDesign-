const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const { getLeaderboard } = require('./controllers/submissionController');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const problemRoutes = require('./routes/problemRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const diagramRoutes = require('./routes/diagramRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIO(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'System Design Platform API',
      version: '1.0.0',
      description: 'RESTful API for a System Design Platform similar to LeetCode',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/diagrams', diagramRoutes);
app.use('/api/upload', uploadRoutes);

// Leaderboard route
app.get('/api/leaderboard', getLeaderboard);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'System Design Platform API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Socket.IO for real-time collaboration
const activeRooms = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a diagram room
  socket.on('join-diagram', ({ diagramId, userId }) => {
    socket.join(`diagram-${diagramId}`);
    
    if (!activeRooms.has(diagramId)) {
      activeRooms.set(diagramId, new Set());
    }
    activeRooms.get(diagramId).add(userId);

    // Notify others in the room
    socket.to(`diagram-${diagramId}`).emit('user-joined', {
      userId,
      activeUsers: Array.from(activeRooms.get(diagramId))
    });

    console.log(`User ${userId} joined diagram ${diagramId}`);
  });

  // Leave a diagram room
  socket.on('leave-diagram', ({ diagramId, userId }) => {
    socket.leave(`diagram-${diagramId}`);
    
    if (activeRooms.has(diagramId)) {
      activeRooms.get(diagramId).delete(userId);
      if (activeRooms.get(diagramId).size === 0) {
        activeRooms.delete(diagramId);
      }
    }

    socket.to(`diagram-${diagramId}`).emit('user-left', {
      userId,
      activeUsers: activeRooms.has(diagramId) ? Array.from(activeRooms.get(diagramId)) : []
    });

    console.log(`User ${userId} left diagram ${diagramId}`);
  });

  // Sync diagram changes
  socket.on('diagram-update', ({ diagramId, data, userId }) => {
    socket.to(`diagram-${diagramId}`).emit('diagram-changed', {
      data,
      userId,
      timestamp: new Date().toISOString()
    });
  });

  // Cursor position updates
  socket.on('cursor-move', ({ diagramId, userId, position }) => {
    socket.to(`diagram-${diagramId}`).emit('cursor-update', {
      userId,
      position
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Clean up active rooms
    activeRooms.forEach((users, diagramId) => {
      users.forEach(userId => {
        socket.to(`diagram-${diagramId}`).emit('user-left', {
          userId,
          activeUsers: Array.from(users)
        });
      });
    });
  });
});

// Error handler middleware (should be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║   System Design Platform API Server               ║
║   Server running on port ${PORT}                   ║
║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
║   API Documentation: http://localhost:${PORT}/api-docs  ║
╚════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});
