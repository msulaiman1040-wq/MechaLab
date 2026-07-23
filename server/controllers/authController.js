const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const registerUser = async (req, res) => {
  try {
    const { fullName, username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      username,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: `Welcome ${fullName}!`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }

    // Generate Token
    // Removed { expiresIn: "1h" } to prevent token expiration
    const token = jwt.sign(
      { user: { id: user._id } },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      message: "Login successful",
      token, 
      fullName: user.fullName,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};