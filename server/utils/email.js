const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verifyLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  try {
    await transporter.sendMail({
      from: `"MechaLab System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your MechaLab account",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Welcome to MechaLab!</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verifyLink}" style="background-color: #0047AB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Nodemailer Error Details:", error);
    throw new Error("Email could not be sent.");
  }
};

const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  try {
    await transporter.sendMail({
      from: `"MechaLab System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your MechaLab password",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Click the button below to proceed:</p>
          <a href="${resetLink}" style="background-color: #0047AB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          <p>This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Nodemailer Error Details:", error);
    throw new Error("Password reset email could not be sent.");
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};