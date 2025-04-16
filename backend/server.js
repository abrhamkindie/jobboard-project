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

// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) return next(new Error("Authentication error"));
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     socket.user = decoded;
//     next();
//   } catch (err) {
//     next(new Error("Invalid token"));
//   }
// });

 
 

 

 
// app.use((req, res, next) => {
//   req.db = db;
//   req.io = io;
//   next();
// });


io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  console.log("Socket.IO - Incoming token:", token ? "Present" : "Missing");

  if (!token) {
    console.error("Socket.IO - No token provided");
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Socket.IO - Decoded token:", decoded);

    // Check for id, employer_id, or jobSeeker_id, and role
    if (!decoded.role || (!decoded.id && !decoded.employer_id && !decoded.jobSeeker_id)) {
      console.error("Socket.IO - Invalid token: missing user identifier or role", { decoded });
      return next(new Error("Invalid token: missing user identifier or role"));
    }

    // Normalize user data
    socket.user = {
      id: decoded.id || decoded.employer_id || decoded.jobSeeker_id,
      role: decoded.role,
      employer_id: decoded.employer_id || null,
      jobSeeker_id: decoded.jobSeeker_id || null,
    };
    console.log("Socket.IO - Authenticated user:", socket.user);
    next();
  } catch (err) {
    console.error("Socket.IO - Token verification error:", err.message);
    return next(new Error("Invalid token: " + err.message));
  }
});

// Socket.IO Connection Handler
io.on("connection", (socket) => {
  console.log("Socket.IO - User connected:", socket.user.id, socket.user.role);

  socket.join(`user:${socket.user.id}`);

  socket.on("disconnect", () => {
    console.log("Socket.IO - User disconnected:", socket.user.id);
  });

  // Handle real-time messages
  socket.on("sendMessage", async (data) => {
    try {
      const { recipientId, content, jobId } = data;
      const senderId = socket.user.id;

      const pool = await connectDB();
      const [result] = await pool.query(
        "INSERT INTO messages (sender_id, recipient_id, job_id, content) VALUES (?, ?, ?, ?)",
        [senderId, recipientId, jobId || null, content]
      );

      const message = {
        id: result.insertId,
        sender_id: senderId,
        recipient_id: recipientId,
        job_id: jobId || null,
        content,
        sent_at: new Date(),
      };

      io.to(`user:${recipientId}`).emit("receiveMessage", message);
      socket.emit("messageSent", message);
    } catch (err) {
      console.error("Socket.IO - Send message error:", err);
      socket.emit("error", { message: "Failed to send message" });
    }
  });
});






app.use(async (req, res, next) => {
  try {
    req.db = await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Express error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
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
