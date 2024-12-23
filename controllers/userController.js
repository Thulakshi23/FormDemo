const User = require('../models/user'); // Ensure the model is imported correctly
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

// Secret key for signing the JWT
const SECRET_KEY = process.env.SECRET_KEY || 'your_default_secret_key';

// Register User
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save(); // Save the user to the database
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log('Request Body:', req.body);

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', user);

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password); // Use bcrypt to compare hashed password
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Password matched successfully');

    // Generate JWT token
    const token = jwt.sign(
      {
        username: user.username,
        isAuthor: user.isAuthor, // Include isAuthor field in the token if exists
      },
      SECRET_KEY,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    console.log('Token generated:', token);

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error.message || error);
    res.status(500).json({ message: 'Error logging in', error: error.message || error });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

// Update User
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    // Hash the password if it's being updated
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, password: hashedPassword }, // Update fields
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
