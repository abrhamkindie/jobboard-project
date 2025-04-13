// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const { LoadConfig } = require('./config/load_config');
// const { ConnectDB } = require('./managers/dbManager');

// const authRoutes = require('./routes/authRoutes');
// const jobRoutes = require('./routes/jobRoutes');
// const jobAlertRoutes = require('./routes/jobAlertRoutes');
// const savedJobRoutes = require('./routes/savedJobRoutes');
// const profileRoutes = require('./routes/profileRoutes');


// const app = express();
// const config = LoadConfig(); // Load config after dotenv is initialized
 
// let db = null;  

// // Check if database configuration is complete
// if (!config || !config.host || !config.user || !config.database) {
//   console.warn('⚠️ Warning: Database Configuration is missing or incomplete.');
// } else {
//   db = ConnectDB(config);
// }

// // If no db connection, exit
// if (!db) {
//   console.error('❌ Database connection failed. Exiting...');
//   process.exit(1);
// }
 
// // Middleware
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(express.json());
// app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));

// // Pass database connection to routes
// app.use((req, res, next) => {
//   req.db = db;
//   next();
// });

// // Routes
// app.use('/profile', profileRoutes); 
// app.use('/auth', authRoutes);
// app.use('/jobs', jobRoutes);
// app.use('/job_alerts', jobAlertRoutes);
// app.use('/save', savedJobRoutes);

// // Serve React frontend
// app.use(express.static(path.join(__dirname, '../../my-react-project/dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../my-react-project/dist/index.html'));
// });

// // Start server
// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`🚀 Server running on http://localhost:${port}`);
// });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');
const { LoadConfig } = require('./config/load_config');
const { ConnectDB } = require('./managers/dbManager');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const jobAlertRoutes = require('./routes/jobAlertRoutes');
const savedJobRoutes = require('./routes/savedJobRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const config = LoadConfig();

let db = null;

if (!config || !config.host || !config.user || !config.database) {
  console.warn('⚠️ Warning: Database Configuration is missing or incomplete.');
} else {
  db = ConnectDB(config);
}

if (!db) {
  console.error('❌ Database connection failed. Exiting...');
  process.exit(1);
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://jobboard-frontend-8nt8.onrender.com',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO middleware to verify JWT
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Attach user data (id, role)
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.id} (${socket.user.role})`);

  // Join role-specific room
  socket.on('join', (room) => {
    socket.join(room);
    console.log(`User ${socket.user.id} joined room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.id}`);
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));
app.use(express.json());
app.use(cors({ origin: 'https://jobboard-frontend-8nt8.onrender.com', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));

app.use((req, res, next) => {
  req.db = db;
  req.io = io;
  next();
});

app.get('/test', (req, res) => res.send('Backend API working'));

app.use('/profile', profileRoutes);
app.use('/auth', authRoutes);
app.use('/jobs', jobRoutes);
app.use('/job_alerts', jobAlertRoutes);
app.use('/save', savedJobRoutes);

// app.use(express.static(path.join(__dirname, '../../my-react-project/dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../my-react-project/dist/index.html'));
// });

 
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});