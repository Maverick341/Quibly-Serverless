import express from 'express';
import cors from 'cors';
import * as sdk from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Appwrite Client
const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT) // Your API Endpoint
  .setProject(process.env.APPWRITE_PROJECT_ID) // Your project ID
  .setKey(process.env.APPWRITE_API_KEY); // Your secret API key

const users = new sdk.Users(client);

// GET all users
app.get('/api/getAllUsers', async (req, res) => {
  try {
    const { queries, search } = req.query;
    
    const result = await users.list({
      queries: queries ? JSON.parse(queries) : [],
      search: search || undefined,
      total: false
    });
    
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      users: result
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// GET user by userId
app.get('/api/getUser/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await users.get({
      userId: userId
    });
    
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      user: result
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
});

// DELETE user by userId
app.delete('/api/deleteUser/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await users.delete({
      userId: userId
    });
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      userId,
      result
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});