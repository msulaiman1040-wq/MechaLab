const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    // 1. If it's a preflight OPTIONS request, let it pass immediately
    if (req.method === 'OPTIONS') {
        return next();
    }

    const token = req.header("x-auth-token");

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Log the decoded token to see if it has the 'user' object
        console.log("DEBUG - Decoded token payload:", decoded);
        
        req.user = decoded.user;
        next();
    } catch (err) {
        // Log the exact error (e.g., 'jwt expired' or 'invalid signature')
        console.error("DEBUG - JWT Verification Error:", err.message);
        
        res.status(401).json({ msg: "Token is not valid" });
    }
};