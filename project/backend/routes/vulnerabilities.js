import express from 'express';
import Vulnerability from '../models/Vulnerability.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all vulnerabilities (public)
router.get('/', async (req, res) => {
  try {
    const vulnerabilities = await Vulnerability.find().select('-__v');
    res.json(vulnerabilities);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single vulnerability (public)
router.get('/:id', async (req, res) => {
  try {
    const vulnerability = await Vulnerability.findById(req.params.id).select('-__v');
    if (!vulnerability) {
      return res.status(404).json({ message: 'Vulnerability not found' });
    }
    res.json(vulnerability);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create vulnerability (admin only)
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const vulnerability = new Vulnerability(req.body);
    await vulnerability.save();
    res.status(201).json(vulnerability);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update vulnerability (admin only)
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const vulnerability = await Vulnerability.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!vulnerability) {
      return res.status(404).json({ message: 'Vulnerability not found' });
    }
    res.json(vulnerability);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete vulnerability (admin only)
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const vulnerability = await Vulnerability.findByIdAndDelete(req.params.id);
    if (!vulnerability) {
      return res.status(404).json({ message: 'Vulnerability not found' });
    }
    res.json({ message: 'Vulnerability deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;