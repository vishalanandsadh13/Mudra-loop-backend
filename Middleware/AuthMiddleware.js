const jwt = require('jsonwebtoken');
const User = require('../Models/User');

exports.protect = async (req, res, next) => {
    let token;

    // Check if the token is in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // If no token, return unauthorized error
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user by ID from the decoded token
        req.user = await User.findById(decoded.id).select('-password');
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
}