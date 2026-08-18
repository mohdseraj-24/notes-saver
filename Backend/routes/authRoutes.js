const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// =========================
// CREATE JWT TOKEN
// =========================

function tokenFor(user) {
  return jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

// =========================
// PUBLIC USER
// =========================

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
}

// =========================
// SIGNUP
// POST /auth/signup
// =========================

router.post("/signup", async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters.",
      });
    }

    // Normalize email
    const normalizedEmail = email
      .toLowerCase()
      .trim();

    // Check existing user
    const existing = await User.findOne({
      email: normalizedEmail,
    });

    if (existing) {
      return res.status(409).json({
        message:
          "An account with this email already exists.",
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(
      password,
      12
    );

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
    });

    // Response
    res.status(201).json({
      token: tokenFor(user),
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
});

// =========================
// LOGIN
// POST /auth/login
// =========================

router.post("/login", async (req, res, next) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required.",
      });
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (
      !user ||
      !(await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    res.json({
      token: tokenFor(user),
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;