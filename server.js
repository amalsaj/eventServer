require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const http = require("http");
const { Server } = require("socket.io");
const router = require("./route/index");

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

// CORS Options
const allowedOrigins = [
  "http://localhost:3000",
  "https://event-client-mauve.vercel.app",
];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

// Apply Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Setup Socket.IO
const io = new Server(server, {
  cors: corsOptions,
});

// Connect to Database
connectDB();

// Attach io to requests for later use
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use("/api/v1", router);

// Landing Route
app.get("/", (req, res) => {
  res.send("Welcome to Event Manager");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

// Start the Server
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
