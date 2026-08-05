/**
 * Express Controller handling AI Chatbot, Manager Analytics & Recommendations
 */

const chatbotService = require('../services/chatbotService');
const aiService = require('../services/aiService');
const Complaint = require('../models/Complaint');

exports.handleChat = async (req, res) => {
  try {
    const { message, sessionState } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message text is required.' });
    }

    const response = await chatbotService.processMessage({
      user: req.user,
      message,
      sessionState
    });

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAIAnalytics = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const pending = await Complaint.countDocuments({ status: 'Pending' });

    // Category Breakdown
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$aiCategory', count: { $sum: 1 } } }
    ]);

    // Department Breakdown
    const departmentStats = await Complaint.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    // Sentiment Breakdown
    const sentimentStats = await Complaint.aggregate([
      { $group: { _id: '$sentiment', count: { $sum: 1 } } }
    ]);

    res.json({
      totalComplaints,
      resolved,
      pending,
      resolutionRate: totalComplaints > 0 ? Math.round((resolved / totalComplaints) * 100) : 0,
      categoryStats,
      departmentStats,
      sentimentStats,
      forecastTomorrow: Math.round(totalComplaints * 0.12 + 15),
      avgSLAHours: 12.4
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.confirmAIChatTicket = async (req, res) => {
  try {
    const { proposal, contactPhone, serviceAddress } = req.body;
    if (!proposal || !contactPhone) {
      return res.status(400).json({ message: 'Proposal payload and contact phone are required.' });
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      title: proposal.title,
      category: 'Network Issue', // standard fallback for schema enum
      description: proposal.description,
      priority: proposal.priority,
      aiCategory: proposal.category,
      aiPriority: proposal.priority,
      department: proposal.department,
      aiConfidence: proposal.aiConfidence || 0.95,
      sentiment: proposal.sentiment || 'Neutral',
      aiSummary: proposal.aiSummary || proposal.title,
      duplicateMatchTicketId: proposal.duplicateMatchTicketId || '',
      contactPhone,
      serviceAddress: serviceAddress || 'Kathmandu'
    });

    res.status(201).json({
      message: 'Ticket successfully created by AI Chatbot.',
      ticket: complaint
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
