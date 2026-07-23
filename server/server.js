require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const configRoutes = require("./routes/configRoutes");

const app = express();

connectDB();

// Middleware - CORS must be defined first
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://mecha-lab-five.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-auth-token"]
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/config", configRoutes);

app.get("/", (req, res) => res.send("MechaLab Backend is Running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));