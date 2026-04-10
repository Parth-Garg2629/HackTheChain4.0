const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const alertRoutes = require('./routes/alerts');
const taskRoutes = require('./routes/tasks');
const messageRoutes = require('./routes/messages');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Attach io to every request so routes can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => res.json({ message: 'ReliefSync API is live 🚀' }));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);

  // Each user joins their personal & role room on connection
  socket.on('join_room', ({ userId, role, zone }) => {
    socket.join(userId);
    socket.join(role); // 'Admin' or 'Volunteer'
    if (zone) socket.join(zone);
    console.log(`🔗 User ${userId} joined rooms: ${role}, ${zone || 'no-zone'}`);
  });

  // 💬 CHAT: Join mission room
  socket.on('join_mission_chat', ({ taskId }) => {
    socket.join(`mission_${taskId}`);
    console.log(`💬 User joined chat room for mission: ${taskId}`);
  });

  // 💬 CHAT: Send message
  socket.on('send_mission_message', async ({ taskId, senderId, content }) => {
    try {
      // Save to DB for persistence
      const message = await Message.create({
        taskId,
        sender: senderId,
        content,
      });

      const populated = await Message.findById(message._id).populate('sender', 'name role');

      // Broadcast to specific mission room
      io.to(`mission_${taskId}`).emit('new_mission_message', populated);
    } catch (err) {
      console.error('Chat Error:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/reliefsync';
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 ReliefSync server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
