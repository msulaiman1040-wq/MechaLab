const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/email");

// Register
const registerUser = async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json({
        message: "Username or email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = new User({
      fullName,
      email,
      username,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });

    await user.save();

    // Send email verification via Resend
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: "Registration successful! Please check your email to verify your account.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    // Check if email is verified before allowing login
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in. Check your inbox for the verification link.",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }

    // Generate Token
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

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check Status (For Frontend Polling)
const checkStatus = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ isVerified: user.isVerified });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  checkStatus,
};