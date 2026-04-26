const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/insights/:userId', async (req, res) => {
  try {
    // Call Python AI Service for behavioral analysis
    /*
    const response = await axios.post('http://ai-service:8000/predict-location', {
      userId: req.params.userId,
      history: [] // Fetch from DB
    });
    return res.json(response.data);
    */

    res.json({
      predicted_location: "Library Cafeteria",
      risk_level: "High",
      suggestion: "You often lose items here in the evening. Stay vigilant, Wizard."
    });
  } catch (err) {
    res.status(500).send('Prophecy Failed');
  }
});

module.exports = router;
