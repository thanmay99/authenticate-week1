const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const CLIENT_ID = ''; // Replace with your actual Google Client ID
const JWT_SECRET = ''; // Secret key for JWT
const client = new OAuth2Client(CLIENT_ID);

// Regular signup (email and password)
const signup = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ username, email, password, phoneNumber });
    await user.save();

    const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({message:'user created', token: jwtToken });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ message: 'Error during sign-up' });
  }
};

// Regular signin (email and password)
const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: jwtToken });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ message: 'Error during sign-in' });
  }
};

// Google Sign-In/Sign-Up
const googleSignin = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, username: name, password: null });
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: jwtToken });
  } catch (error) {
    console.error('Google Sign-In/Sign-Up failed:', error);
    res.status(500).json({ message: 'Google Sign-In/Sign-Up failed' });
  }
};

module.exports = { signup, signin, googleSignin };
