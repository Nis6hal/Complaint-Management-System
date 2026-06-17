const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect } = require('../middleware/auth');

// All routes require login
router.use(protect);

// POST /api/complaints — submit a new complaint
router.post('/', async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      priority,
      contactName,
      contactPhone,
      contactEmail,
      serviceAddress,
      preferredContactMethod,
    } = req.body;

    if (!title || !category || !description || !contactPhone)
      return res.status(400).json({ message: 'Title, category, description and contact phone are required.' });

    const complaint = await Complaint.create({
      user: req.user._id,
      title,
      category,
      description,
      priority: priority || 'Medium',
      contactName,
      contactPhone,
      contactEmail,
      serviceAddress,
      preferredContactMethod,
    });

    res.status(201).json({ complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/complaints — get logged-in user's complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/complaints/:id — get single complaint (owned by user)
router.get('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ _id: req.params.id, user: req.user._id });
    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });
    res.json({ complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/complaints/:id — delete own complaint (only if Pending)
router.delete('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ _id: req.params.id, user: req.user._id });
    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });

    if (complaint.status !== 'Pending')
      return res.status(400).json({ message: 'Only pending complaints can be deleted.' });

    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
