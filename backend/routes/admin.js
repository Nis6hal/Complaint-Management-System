const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require login + admin role
router.use(protect, adminOnly);

// GET /api/admin/complaints — get all complaints with filters
router.get('/complaints', async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ complaints, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/complaints/:id — update status and add admin note
router.patch('/complaints/:id', async (req, res) => {
  try {
    const { status, adminNote, priority } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });

    if (status) complaint.status = status;
    if (adminNote !== undefined) complaint.adminNote = adminNote;
    if (priority) complaint.priority = priority;

    await complaint.save();
    await complaint.populate('user', 'name email phone');

    res.json({ complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/stats — dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const closed = await Complaint.countDocuments({ status: 'Closed' });
    const totalUsers = await User.countDocuments({ role: 'user' });

    const byCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const byPriority = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.json({ total, pending, inProgress, resolved, closed, totalUsers, byCategory, byPriority });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users — get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users/:id — get one user profile and recent complaints
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const complaintCount = await Complaint.countDocuments({ user: req.params.id });
    const latestComplaints = await Complaint.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .limit(8)
      .select('title category status createdAt');

    res.json({ user, complaintCount, latestComplaints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/complaints/:id — hard delete
router.delete('/complaints/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });
    res.json({ message: 'Complaint permanently deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
