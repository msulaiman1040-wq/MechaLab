const sendVerificationEmail = async (email, token) => {
  const verifyLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "MechaLab System", email: process.env.SENDER_EMAIL },
      to: [{ email: email }],
      subject: "Verify your MechaLab account",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Welcome to MechaLab!</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verifyLink}" style="background-color: #0047AB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Brevo API Error:", errorData);
    throw new Error("Email could not be sent.");
  }
};

const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "MechaLab System", email: process.env.SENDER_EMAIL },
      to: [{ email: email }],
      subject: "Reset your MechaLab password",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Click the button below to proceed:</p>
          <a href="${resetLink}" style="background-color: #0047AB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          <p>This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Brevo API Error:", errorData);
    throw new Error("Password reset email could not be sent.");
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};