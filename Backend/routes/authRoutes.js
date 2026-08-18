const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

function tokenFor(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required.' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ message: 'An account with this email already exists.' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: normalizedEmail, password: hashed });

    res.status(201).json({ token: tokenFor(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase().trim() });

    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({ token: tokenFor(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
