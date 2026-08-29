import React, { useState } from 'react';
import {
  Box, Fab, Drawer, Typography, TextField, IconButton, Paper,
  Button, Chip, CircularProgress, Divider, Alert
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
const SmartToyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12zm-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm6 0c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13zm-6 3h6v1.5H9V16z"/></svg>
);
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
);
const SendIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
);
const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
);
import axios from 'axios';

const AIChatbotWidget = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '👋 Namaste! I am the **Nepal Telecom AI Assistant**. How can I help you today? You can describe a complaint, check ticket status, or ask for troubleshooting advice.'
    }
  ]);
  const [pendingProposal, setPendingProposal] = useState(null);
  const [contactPhone, setContactPhone] = useState('');

  const quickReplies = [
    { label: '🌐 Fiber Internet Down', text: 'My fiber internet is not working' },
    { label: '🔴 LOS Red Light', text: 'My router has a red blinking LOS light' },
    { label: '📱 SIM / VoLTE Issue', text: 'Call and SMS not working on SIM' },
    { label: '📋 Check Ticket Status', text: 'Check my complaint ticket status' }
  ];

  const handleQuickReply = (text) => {
    setInput(text);
    handleSendText(text);
  };

  const handleSendText = async (customText) => {
    const userMsg = (customText || input).trim();
    if (!userMsg) return;
    setInput('');

    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/ai/chat',
        { message: userMsg },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [...prev, { sender: 'bot', text: res.data.reply }]);

      if (res.data.action === 'PROPOSE_REGISTRATION' && res.data.proposal) {
        setPendingProposal(res.data.proposal);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '⚠️ Connection issue with AI Assistant. Please ensure backend server is running.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => handleSendText(input);

  const handleConfirmTicket = async () => {
    if (!contactPhone.trim()) {
      alert('Please enter your contact phone number to register ticket.');
      return;
    }
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/ai/confirm-ticket',
        { proposal: pendingProposal, contactPhone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `✅ **Ticket Registered Successfully!**\nYour Official Ticket ID is \`${res.data.ticket.ticketId}\`. Assigned Department: **${res.data.ticket.department}**.`
        }
      ]);
      setPendingProposal(null);
      setContactPhone('');
    } catch (err) {
      alert('Failed to register ticket via AI: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="ai-chat"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: { xs: 12, sm: 24 },
          right: { xs: 12, sm: 24 },
          width: { xs: 44, sm: 56 },
          height: { xs: 44, sm: 56 },
          boxShadow: '0 8px 24px rgba(25, 118, 210, 0.4)',
          background: 'linear-gradient(135deg, #0052D4 0%, #4364F7 50%, #6FB1FC 100%)',
          display: { xs: open ? 'none' : 'flex', sm: 'flex' }
        }}
      >
        <SmartToyIcon />
      </Fab>

      {/* Slide-out Drawer Widget */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100vw', sm: 420 },
            height: { xs: '100dvh', sm: '100%' },
            maxHeight: '100dvh',
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }
        }}
      >
        {/* Header */}
        <Box sx={{ p: { xs: 1.5, sm: 2 }, backgroundColor: '#0052D4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, minWidth: 0 }}>
            <SmartToyIcon />
            <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" noWrap>NTC AI Assistant</Typography>
          </Box>
          <IconButton color="inherit" onClick={() => setOpen(false)} size={isMobile ? "small" : "medium"} sx={{ flexShrink: 0 }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Quick Suggestion Chips */}
        <Box
          sx={{
            px: { xs: 0.75, sm: 1 },
            py: 0.75,
            backgroundColor: '#eef2f6',
            display: 'flex',
            gap: 0.5,
            overflowX: 'auto',
            flexWrap: 'nowrap',
            flexShrink: 0,
            // Hide scrollbar but keep scroll functionality
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          {quickReplies.map((qr, idx) => (
            <Chip
              key={idx}
              label={qr.label}
              size="small"
              onClick={() => handleQuickReply(qr.text)}
              clickable
              color="primary"
              variant="outlined"
              sx={{
                backgroundColor: '#fff',
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                whiteSpace: 'nowrap',   // Fixed: was 'whitespace' (invalid CSS-in-JS key)
                flexShrink: 0,
              }}
            />
          ))}
        </Box>

        {/* Message Log */}
        <Box sx={{ flex: 1, p: { xs: 1, sm: 2 }, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 2 }, backgroundColor: '#f8f9fa', minHeight: 0 }}>
          {messages.map((m, idx) => (
            <Box
              key={idx}
              sx={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: { xs: '92%', sm: '85%' },
                p: { xs: 1.2, sm: 1.8 },
                borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                backgroundColor: m.sender === 'user' ? '#1976d2' : '#ffffff',
                color: m.sender === 'user' ? '#ffffff' : '#1a1a1a',
                boxShadow: m.sender === 'bot' ? '0 1px 4px rgba(0,0,0,0.04)' : 'none',
                whiteSpace: 'pre-line',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              <Typography variant={isMobile ? "caption" : "body2"} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>{m.text}</Typography>
            </Box>
          ))}

          {/* Interactive Card Confirmation */}
          {pendingProposal && (
            <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2 }, border: '2px solid #1976d2', borderRadius: 2, overflow: 'hidden' }}>
              <Typography variant={isMobile ? "subtitle2" : "subtitle1"} color="primary" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                📋 Confirm Automatic Ticket Registration
              </Typography>
              <Typography variant="caption" display="block" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}><b>Category:</b> {pendingProposal.category}</Typography>
              <Typography variant="caption" display="block" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}><b>Priority:</b> {pendingProposal.priority}</Typography>
              <Typography variant="caption" display="block" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}><b>Department:</b> {pendingProposal.department}</Typography>
              
              <TextField
                size="small"
                fullWidth
                placeholder="Enter Phone Number"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                sx={{ mt: { xs: 1, sm: 1.5 }, mb: { xs: 1, sm: 1.5 } }}
              />

              <Button
                variant="contained"
                size={isMobile ? "medium" : "small"}
                fullWidth
                startIcon={<CheckCircleIcon />}
                onClick={handleConfirmTicket}
                disabled={loading}
              >
                Register Ticket Now
              </Button>
            </Paper>
          )}

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <CircularProgress size={isMobile ? 14 : 16} />
              <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>AI Model is thinking...</Typography>
            </Box>
          )}
        </Box>

        {/* Input Bar */}
        <Box
          sx={{
            p: { xs: 1, sm: 1.5 },
            backgroundColor: '#fff',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            gap: 1,
            flexShrink: 0,
            // Safe area inset for iOS home indicator / Android nav bar
            paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Type in English or नेपाली (e.g. इन्टरनेट चलेन)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <IconButton color="primary" onClick={handleSend} disabled={loading} size={isMobile ? "medium" : "small"} sx={{ flexShrink: 0 }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Drawer>
    </>
  );
};

export default AIChatbotWidget;
