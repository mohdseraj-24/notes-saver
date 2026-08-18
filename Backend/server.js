const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// =========================
// CORS
// =========================

const allowedOrigins = [
  "https://notes-saver-gold.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  process.env.FRONTEND_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

// =========================
// JSON
// =========================

app.use(express.json());

// =========================
// HOME
// =========================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Notes API is running",
  });
});

// =========================
// HEALTH CHECK
// =========================

app.get("/api/health", (req, res) => {
  res.json({
    api: "running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// =========================
// AUTH ROUTES
// =========================
// POST /auth/signup
// POST /auth/login

app.use(
  "/auth",
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

// =========================
// NOTES ROUTES
// =========================
// Keep your existing notes API

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

// =========================
// ERROR HANDLER
// =========================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(
    err.name === "ValidationError" ? 400 : 500
  ).json({
    message:
      err.name === "ValidationError"
        ? err.message
        : "Server error",
  });
});

// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// =========================
// MONGODB
// =========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB error:", err.message);
  });