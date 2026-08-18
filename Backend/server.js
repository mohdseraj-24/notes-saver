const express = require("express");
const cors = require("cors");

const app = express();

// =========================
// CORS CONFIGURATION
// =========================

const allowedOrigins = [
  "https://notes-saver-gold.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
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

// Handle browser preflight requests
app.options("*", cors());

// =========================
// BODY PARSER
// =========================

app.use(express.json());

// =========================
// ROUTES
// =========================

// Signup
// POST https://notes-saver-bt4g.onrender.com/auth/signup

// Login
// POST https://notes-saver-bt4g.onrender.com/auth/login

app.use("/auth", require("./routes/auth"));

// Notes routes
app.use("/notes", require("./routes/notes"));

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Notes Saver API is running",
  });
});

// =========================
// ERROR HANDLER
// =========================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Internal server error",
  });
});

// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});