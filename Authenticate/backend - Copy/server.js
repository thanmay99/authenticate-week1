const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = 5000;

// MongoDB connection URI
const DB_URI = 'mongodb://localhost:27017/signupSignin'; // Replace with your MongoDB URI if different

// Middleware
app.use(cors());
app.use(bodyParser.json()); // JSON parser

// MongoDB connection
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });


// Test route to verify server is running
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Routes
app.use('/auth', authRoutes);

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
