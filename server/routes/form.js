const express = require('express');
const router = express.Router();
const FormData = require('../models/FormData');
const auth = require('../middleware/auth');

// Get all form submissions for the logged-in user
router.get('/submissions', auth, async (req, res) => {
  try {
    console.log('Fetching submissions for user:', req.user._id);
    
    // Find all form submissions for this user
    const userSubmissions = await FormData.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
      
    console.log('Found submissions:', userSubmissions.length);
    
    if (!userSubmissions || userSubmissions.length === 0) {
      return res.json({ submissions: {} });
    }
    
    // Create an object with IDs as keys
    const submissions = {};
    userSubmissions.forEach(submission => {
      submissions[submission._id] = submission;
    });
    
    res.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Error fetching submissions' });
  }
});

// Get form data for a specific page
router.get('/:page', auth, async (req, res) => {
  try {
    const { page } = req.params;
    const formData = await FormData.findOne({ user: req.user._id });
    
    if (!formData) {
      return res.json({ [page]: {} });
    }

    res.json({ [page]: formData[page] || {} });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching form data' });
  }
});

// Save form data for a specific page
router.post('/:page', auth, async (req, res) => {
  try {
    const { page } = req.params;
    const pageData = req.body;

    let formData = await FormData.findOne({ user: req.user._id });

    if (!formData) {
      formData = new FormData({
        user: req.user._id,
        userEmail: req.user.email,
        [page]: pageData
      });
    } else {
      formData[page] = pageData;
      if (!formData.userEmail) {
        formData.userEmail = req.user.email;
      }
    }

    await formData.save();

    // Update user's formData reference if it doesn't exist
    if (!req.user.formData) {
      req.user.formData = formData._id;
      await req.user.save();
    }

    res.json({ message: 'Form data saved successfully', [page]: pageData });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ error: 'Error saving form data' });
  }
});

// Get all form data
router.get('/', auth, async (req, res) => {
  try {
    const formData = await FormData.findOne({ user: req.user._id });
    res.json(formData || {});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching form data' });
  }
});

module.exports = router; 