const express = require('express');
const { signup, signin, googleSignin } = require('../controllers/authController');
const router = express.Router();

// Route for regular sign-up
router.post('/signup', signup);

// Route for regular sign-in
router.post('/signin', signin);

// Route for Google Sign-In/Sign-Up
router.post('/google-signin', googleSignin);

module.exports = router;
