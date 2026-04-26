const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, enrollmentNo, phone, password, branch, year, adminCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { enrollmentNo }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Email or Enrollment No. already registered.' });
    }

    // Check if registering as admin
    let role = 'student';
    if (adminCode) {
      if (adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
        return res.status(403).json({ message: 'Invalid admin registration code.' });
      }
      role = 'admin';
    }

    const user = await User.create({ name, email, enrollmentNo, phone, password, branch, year, role });

    // Award XP for registering
    user.xp = 10;
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      message: 'Registration successful! Welcome to PokeFind!',
      token,
      user: {
        id: user._id, name: user.name, email: user.email,
        enrollmentNo: user.enrollmentNo, role: user.role,
        xp: user.xp, level: user.level, branch: user.branch,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration.', error: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated.' });
    }

    const token = generateToken(user._id);
    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id, name: user.name, email: user.email,
        enrollmentNo: user.enrollmentNo, role: user.role,
        xp: user.xp, level: user.level, branch: user.branch,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login.', error: err.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { register, login, getMe };
