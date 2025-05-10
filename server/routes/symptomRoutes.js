const express = require('express');
const SymptomService = require('../services/symptomService');
const { requireUser } = require('./middleware/auth');

const router = express.Router();

// Create a new symptom record
router.post('/analyze-symptoms', requireUser, async (req, res) => {
  try {
    console.log('Received symptom analysis request with body:', req.body);
    console.log('User ID from auth middleware:', req.user?._id);

    const { name, age, location, symptoms } = req.body;

    if (!name || !age || !location || !symptoms) {
      console.log('Missing required fields in symptom analysis request');
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, age, location, symptoms'
      });
    }

    // Create the symptom record
    console.log('Creating symptom record for user:', req.user._id);
    const symptomRecord = await SymptomService.create({
      userId: req.user._id,
      name,
      age,
      location,
      symptoms
    });
    console.log('Symptom record created with ID:', symptomRecord._id);

    // Analyze the symptoms
    console.log('Analyzing symptoms...');
    const analysisResult = await SymptomService.analyzeSymptoms({
      name,
      age,
      location,
      symptoms
    });
    console.log('Analysis complete');

    res.status(201).json({
      success: true,
      result: analysisResult,
      symptomId: symptomRecord._id
    });
  } catch (error) {
    console.error(`Error creating symptom record: ${error}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create symptom record'
    });
  }
});

// Get user's symptom history
router.get('/', requireUser, async (req, res) => {
  try {
    const symptoms = await SymptomService.getByUserId(req.user._id);
    res.status(200).json({
      success: true,
      symptoms
    });
  } catch (error) {
    console.error(`Error fetching symptoms: ${error}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch symptoms'
    });
  }
});

// Get analysis for a specific symptom record
router.get('/:symptomId/analysis', requireUser, async (req, res) => {
  try {
    const { symptomId } = req.params;
    console.log(`Requesting analysis for symptom ID: ${symptomId}`);
    
    // Get the symptom record
    const symptomRecord = await SymptomService.get(symptomId);
    
    if (!symptomRecord) {
      return res.status(404).json({
        success: false,
        message: 'Symptom record not found'
      });
    }
    
    // Verify the symptom record belongs to the authenticated user
    if (symptomRecord.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this record'
      });
    }
    
    // Get the analysis
    const analysisResult = await SymptomService.analyzeSymptomById(symptomId);
    
    res.status(200).json({
      success: true,
      result: analysisResult,
      symptomId
    });
  } catch (error) {
    console.error(`Error analyzing symptom record: ${error}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze symptom record'
    });
  }
});

module.exports = router;