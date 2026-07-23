const express = require("express");
const router = express.Router();
const Configuration = require("../models/Configuration");
const auth = require("../middleware/authMiddleware");

// Save new configuration
router.post("/save", auth, async (req, res) => {
    try {
        const { name, parts } = req.body;
        if (!name || !parts) {
            return res.status(400).json({ message: "Name and parts are required" });
        }
        const newConfig = new Configuration({ 
            userId: req.user.id,
            name, 
            parts 
        });
        await newConfig.save();
        res.status(201).json(newConfig);
    } catch (err) { 
        console.error("Save error:", err);
        res.status(500).json({ error: "Failed to save" }); 
    }
});

// Fetch user configurations
router.get("/my-configs", auth, async (req, res) => {
    try {
        const configs = await Configuration.find({ userId: req.user.id });
        res.json(configs);
    } catch (err) { res.status(500).json({ error: "Failed to fetch" }); }
});

// Delete configuration
router.delete("/delete/:id", auth, async (req, res) => {
    try {
        const config = await Configuration.findById(req.params.id);
        if (!config || config.userId.toString() !== req.user.id) {
            return res.status(404).json({ msg: "Config not found or unauthorized" });
        }
        await Configuration.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) { res.status(500).json({ error: "Failed to delete" }); }
});

module.exports = router;