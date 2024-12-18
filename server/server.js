require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./model/user.model'); // Import the User model
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
const runServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

runServer();

// POST Route: Add a comment with a password
app.post('/api/user', async (req, res) => {
  try {
    const data = await User.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET Route: Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const data = await User.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET Route: Fetch user comments by ID
app.get('/api/user/find', async (req, res) => {
  const { id } = req.query;

  try {
    if (!id) return res.status(400).json({ message: 'User ID is required' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      id: user._id,
      comment: user.comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
