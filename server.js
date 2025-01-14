require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const http = require("http");
const { Server } = require("socket.io");
const router = require("./route/index");

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "https://event-client-mauve.vercel.app",
];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

const io = new Server(server, {
  cors: corsOptions,
});

connectDB();

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Welcome to Event Manager");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
