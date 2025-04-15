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





// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const { Server } = require('socket.io');
// const http = require('http');
// const { LoadConfig } = require('./config/load_config');
// const { ConnectDB } = require('./managers/dbManager');
// const jwt = require('jsonwebtoken');
// const uploadRoutes = require('./routes/uploadRoutes');

// const authRoutes = require('./routes/authRoutes');
// const jobRoutes = require('./routes/jobRoutes');
// const jobAlertRoutes = require('./routes/jobAlertRoutes');
// const savedJobRoutes = require('./routes/savedJobRoutes');
// const profileRoutes = require('./routes/profileRoutes');

// const app = express();
// const config = LoadConfig();

// let db = null;

// if (!config || !config.host || !config.user || !config.database) {
//   console.warn('⚠️ Warning: Database Configuration is missing or incomplete.');
// } else {
//   db = ConnectDB(config);
// }

// if (!db) {
//   console.error('❌ Database connection failed. Exiting...');
//   process.exit(1);
// }

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: 'https://jobboard-frontend-8nt8.onrender.com',
//     methods: ['GET', 'POST'],
//   },
// });

// // Socket.IO middleware to verify JWT
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) return next(new Error('Authentication error'));

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     socket.user = decoded; // Attach user data (id, role)
//     next();
//   } catch (err) {
//     next(new Error('Invalid token'));
//   }
// });

// io.on('connection', (socket) => {
//   console.log(`User connected: ${socket.user.id} (${socket.user.role})`);

//   // Join role-specific room
//   socket.on('join', (room) => {
//     socket.join(room);
//     console.log(`User ${socket.user.id} joined room ${room}`);
//   });

//   socket.on('disconnect', () => {
//     console.log(`User disconnected: ${socket.user.id}`);
//   });
// });

// app.use('/upload', uploadRoutes);
// //app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));
// app.use(express.json());
// app.use(cors({ origin: 'https://jobboard-frontend-8nt8.onrender.com', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));

// app.use((req, res, next) => {
//   req.db = db;
//   req.io = io;
//   next();
// });

// app.get('/test', (req, res) => res.send('Backend API working'));

// app.use('/profile', profileRoutes);
// app.use('/auth', authRoutes);
// app.use('/jobs', jobRoutes);
// app.use('/job_alerts', jobAlertRoutes);
// app.use('/save', savedJobRoutes);

// // app.use(express.static(path.join(__dirname, '../../my-react-project/dist')));
// // app.get('*', (req, res) => {
// //   res.sendFile(path.join(__dirname, '../../my-react-project/dist/index.html'));
// // });

 
// const port = process.env.PORT || 5000;
// server.listen(port, () => {
//   console.log(`🚀 Server running on http://localhost:${port}`);
// });

 



const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const uploadRoutes = require("./routes/uploadRoutes");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const jobAlertRoutes = require("./routes/jobAlertRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://jobboard-frontend-8nt8.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

let db;
async function initializeDB() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST || "mysql-1294dc4d-abrhamkindie805-dcff.k.aivencloud.com",
      port: process.env.DB_PORT || 20768,
      user: process.env.DB_USER || "avnadmin",
      password: process.env.DB_PASSWORD || "AVNS_bkfo85lyr0rDpfPoS9U",
      database: process.env.DB_NAME || "defaultdb",
      ssl: { ca: process.env.DB_SSL_CA || require("fs").readFileSync("./ca.pem") },
    });
    console.log("Connected to MySQL");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
}

initializeDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://jobboard-frontend-8nt8.onrender.com",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.user.id} (${socket.user.role})`);
//   socket.on("join", (room) => {
//     socket.join(room);
//     console.log(`User ${socket.user.id} joined room ${room}`);
//   });
//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.user.id}`);
//   });
// });



io.on("connection", (socket) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log("User connected: no token");
    socket.disconnect();
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user.id || !user.role) {
      throw new Error("Invalid token: missing id or role");
    }
    socket.user = user; // Store user for disconnect
    console.log(`User connected: ${user.id} (${user.role})`);

    const room = `${user.role}:${user.employer_id || user.jobSeeker_id || user.id}`;
    socket.join(room);
    console.log(`User ${user.id} joined room ${room}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${user.id}`);
    });
  } catch (err) {
    console.error("Socket auth error:", err);
    socket.disconnect();
  }
});

app.use((req, res, next) => {
  req.db = db;
  req.io = io;
  next();
});

app.use("/upload", uploadRoutes);
app.use("/profile", profileRoutes);
app.use("/auth", authRoutes);
app.use("/jobs", jobRoutes);
app.use("/job_alerts", jobAlertRoutes);
app.use("/save", savedJobRoutes);

app.get("/test", (req, res) => res.send("Backend API working"));

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
