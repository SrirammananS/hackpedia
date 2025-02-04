const express = require('express');
const router = express.Router();
const Vulnerability = require('../models/Vulnerability');

// Get all vulnerabilities
router.get('/', async (req, res) => {
  try {
    const vulnerabilities = await Vulnerability.find();
    res.json(vulnerabilities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single vulnerability
router.get('/:id', async (req, res) => {
  try {
    const vulnerability = await Vulnerability.findById(req.params.id);
    if (vulnerability) {
      res.json(vulnerability);
    } else {
      res.status(404).json({ message: 'Vulnerability not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;