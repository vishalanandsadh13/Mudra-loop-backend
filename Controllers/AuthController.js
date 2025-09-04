const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body || {};
    
    //check for Validation
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try{
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }   

        // Create new user
        const user = await User.create({
            fullName,
            email,
            password,
        }); 

        res.status(201).json({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });  
    }
};

const loginUser = async (req, res) => {

    const { email, password } = req.body || {};

    // Check for Validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserInfo = async (req, res) => {
    const userId = req.user.id; // Assuming user ID is stored in req.user after authentication

    try {
        // Fetch user information
        const user = await User.findById(userId).select('-password'); // Exclude password from response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }       
        res.status(200).json({user});
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserInfo,
    generateToken,
};