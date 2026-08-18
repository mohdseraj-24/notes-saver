const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "https://notes-saver-gold.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));

app.options("*", cors());

app.use(express.json());

const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  process.env.FRONTEND_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());

// Home
app.get("/", (req, res) => {
  res.send("Notes API is running");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    api: "running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// Authentication routes
app.use(
  "/api/auth",
  (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message:
          "Database unavailable. Check MongoDB Atlas Network Access and your MONGO_URI.",
      });
    }

    next();
  },
  authRoutes
);

// Notes routes
app.use(
  "/api/notes",
  (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message:
          "Database unavailable. Check MongoDB Atlas Network Access and your MONGO_URI.",
      });
    }

    next();
  },
  noteRoutes
);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(err.name === "ValidationError" ? 400 : 500).json({
    message:
      err.name === "ValidationError"
        ? err.message
        : "Server error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB error:", err.message);
  });