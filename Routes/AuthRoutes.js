const express = require('express');

const{ registerUser, loginUser, getUserInfo} = require('../Controllers/AuthController');

const { protect } = require('../Middleware/AuthMiddleware');
const router = express.Router();

// Route for user registration
router.post('/register', registerUser);
// Route for user login
router.post('/login', loginUser);
// Route to get user information
 router.get('/getUser', protect, getUserInfo);

module.exports = router;