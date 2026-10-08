import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Fab, Drawer, Typography, TextField, IconButton, Paper,
  Button, Chip, CircularProgress
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

// ── Design tokens aligned with the TelcoResolve system ──────────────────────
const BRAND_PRIMARY = '#1d4ed8';
const BRAND_DARK    = '#0f172a';
const BRAND_SURFACE = '#f8fafc';
const BRAND_BORDER  = '#e2e8f0';
const BRAND_TEXT    = '#0f172a';
const BRAND_MUTED   = '#64748b';

// Minimal MUI theme override — only affects this widget's MUI components
const widgetTheme = createTheme({
  palette: {
    primary: {
      main: BRAND_PRIMARY,
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  shape: { borderRadius: 10 },
  components: {
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: 'inherit', fontWeight: 600 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { fontFamily: 'inherit', fontWeight: 600, textTransform: 'none', borderRadius: 10 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { fontFamily: 'inherit' },
      },
    },
  },
});

// ── Inline SVG icons (no extra package needed) ───────────────────────────────
const BotIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12zm-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm6 0c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13zm-6 3h6v1.5H9V16z"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

// ── Component ────────────────────────────────────────────────────────────────
const AIChatbotWidget = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am the Nepal Telecom AI Assistant.\n\nDescribe a complaint, check ticket status, or ask for troubleshooting advice — in English or Nepali.',
    },
  ]);
  const [pendingProposal, setPendingProposal] = useState(null);
  const [contactPhone, setContactPhone] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingProposal]);

  const quickReplies = [
    { label: 'Fiber Internet Down', text: 'My fiber internet is not working' },
    { label: 'LOS Red Light', text: 'My router has a red blinking LOS light' },
    { label: 'Check Ticket Status', text: 'Check my complaint ticket status' },
    { label: 'Slow Speed', text: 'Internet speed is very slow' },
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
        `${process.env.REACT_APP_API_URL}/ai/chat`,
        { message: userMsg },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, { sender: 'bot', text: res.data.reply }]);
      if (res.data.action === 'PROPOSE_REGISTRATION' && res.data.proposal) {
        setPendingProposal(res.data.proposal);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Connection issue with AI Assistant. Please ensure the backend server is running.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => handleSendText(input);

  const handleConfirmTicket = async () => {
    if (!contactPhone.trim()) {
      alert('Please enter your contact phone number to register the ticket.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/ai/confirm-ticket`,
        { proposal: pendingProposal, contactPhone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Ticket Registered Successfully!\n\nYour Official Ticket ID is: ${res.data.ticket.ticketId}\nAssigned Department: ${res.data.ticket.department}`,
        },
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
    <ThemeProvider theme={widgetTheme}>
      {/* ── Floating Action Button ── */}
      <Fab
        color="primary"
        aria-label="Open AI Chat Assistant"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 28 },
          right: { xs: 16, sm: 28 },
          width: { xs: 48, sm: 56 },
          height: { xs: 48, sm: 56 },
          background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${BRAND_PRIMARY} 100%)`,
          boxShadow: '0 8px 24px rgba(29, 78, 216, 0.45)',
          display: { xs: open ? 'none' : 'flex', sm: 'flex' },
          zIndex: 1200,
          '&:hover': {
            background: `linear-gradient(135deg, #1e293b 0%, #1e40af 100%)`,
          },
        }}
      >
        <BotIcon />
      </Fab>

      {/* ── Drawer Panel ── */}
      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            height: { xs: '92dvh', sm: '100%' },
            maxHeight: { xs: '92dvh', sm: '100dvh' },
            ...(isMobile
              ? { borderTopLeftRadius: 14, borderTopRightRadius: 14 }
              : { width: 420 }),
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxSizing: 'border-box',
            fontFamily: "'Inter', sans-serif",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${BRAND_PRIMARY} 100%)`,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
            <Box
              sx={{
                width: 36, height: 36,
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <BotIcon />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: 15, sm: 16 },
                  lineHeight: 1.2,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
                noWrap
              >
                NTC AI Assistant
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                Powered by Nepal Telecom ML
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => setOpen(false)}
            size="small"
            sx={{
              color: '#fff',
              background: 'rgba(255,255,255,0.12)',
              '&:hover': { background: 'rgba(255,255,255,0.22)' },
              flexShrink: 0,
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Quick Reply Chips */}
        <Box
          sx={{
            px: 1.5,
            py: 1,
            background: '#ffffff',
            borderBottom: `1px solid ${BRAND_BORDER}`,
            display: 'flex',
            gap: 0.75,
            overflowX: 'auto',
            flexWrap: 'nowrap',
            flexShrink: 0,
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
              sx={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: BRAND_PRIMARY,
                fontSize: { xs: '0.7rem', sm: '0.72rem' },
                fontWeight: 600,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                '&:hover': { background: '#dbeafe' },
              }}
            />
          ))}
        </Box>

        {/* Message Area */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 1.25, sm: 1.75 },
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1.25, sm: 1.5 },
            background: BRAND_SURFACE,
            minHeight: 0,
          }}
        >
          {messages.map((m, idx) => (
            <Box
              key={idx}
              sx={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: { xs: '90%', sm: '84%' },
              }}
            >
              {m.sender === 'bot' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <Box
                    sx={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${BRAND_PRIMARY} 100%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <BotIcon />
                  </Box>
                  <Typography sx={{ fontSize: 11, color: BRAND_MUTED, fontWeight: 600 }}>
                    AI Assistant
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  p: { xs: '10px 13px', sm: '12px 15px' },
                  borderRadius:
                    m.sender === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background:
                    m.sender === 'user'
                      ? `linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #2563eb 100%)`
                      : '#ffffff',
                  color: m.sender === 'user' ? '#ffffff' : BRAND_TEXT,
                  border: m.sender === 'bot' ? `1px solid ${BRAND_BORDER}` : 'none',
                  boxShadow:
                    m.sender === 'bot'
                      ? '0 1px 3px rgba(15,23,42,0.06)'
                      : '0 2px 8px rgba(29,78,216,0.25)',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.85rem' },
                    lineHeight: 1.55,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {m.text}
                </Typography>
              </Box>
            </Box>
          ))}

          {/* Pending Ticket Confirmation Card */}
          {pendingProposal && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2 },
                border: `2px solid ${BRAND_PRIMARY}`,
                borderRadius: '12px',
                background: '#eff6ff',
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  color: BRAND_PRIMARY,
                  mb: 1.25,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                }}
              >
                <CheckIcon /> Confirm Ticket Registration
              </Typography>

              {[
                { label: 'Category', value: pendingProposal.category },
                { label: 'Priority', value: pendingProposal.priority },
                { label: 'Department', value: pendingProposal.department },
              ].map(({ label, value }) => (
                <Box
                  key={label}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    py: 0.4,
                    borderBottom: `1px solid #bfdbfe`,
                  }}
                >
                  <Typography sx={{ fontSize: 'inherit', color: BRAND_MUTED, fontWeight: 600 }}>
                    {label}
                  </Typography>
                  <Typography sx={{ fontSize: 'inherit', fontWeight: 600, color: BRAND_TEXT }}>
                    {value}
                  </Typography>
                </Box>
              ))}

              <TextField
                size="small"
                fullWidth
                placeholder="Your contact phone number"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                sx={{
                  mt: 1.5,
                  mb: 1.25,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    fontFamily: 'inherit',
                    fontSize: '0.85rem',
                    '& fieldset': { borderColor: '#bfdbfe' },
                    '&:hover fieldset': { borderColor: BRAND_PRIMARY },
                    '&.Mui-focused fieldset': { borderColor: BRAND_PRIMARY },
                  },
                }}
              />

              <Button
                variant="contained"
                fullWidth
                startIcon={<CheckIcon />}
                onClick={handleConfirmTicket}
                disabled={loading}
                sx={{
                  background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${BRAND_PRIMARY} 100%)`,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  py: 1,
                  borderRadius: '8px',
                  '&:hover': {
                    background: `linear-gradient(135deg, #1e293b 0%, #1e40af 100%)`,
                  },
                }}
              >
                Register Ticket
              </Button>
            </Paper>
          )}

          {/* Typing Indicator */}
          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${BRAND_PRIMARY} 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BotIcon />
              </Box>
              <Box
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.5,
                  px: 1.5, py: 1,
                  background: '#ffffff',
                  border: `1px solid ${BRAND_BORDER}`,
                  borderRadius: '14px 14px 14px 4px',
                  boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
                }}
              >
                <CircularProgress size={12} thickness={5} sx={{ color: BRAND_PRIMARY }} />
                <Typography sx={{ fontSize: '0.78rem', color: BRAND_MUTED, ml: 0.5 }}>
                  AI is thinking...
                </Typography>
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input Bar */}
        <Box
          sx={{
            p: { xs: 1, sm: 1.25 },
            background: '#ffffff',
            borderTop: `1px solid ${BRAND_BORDER}`,
            display: 'flex',
            gap: 1,
            flexShrink: 0,
            paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Type in English or Nepali (नेपाली)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                '& fieldset': { borderColor: BRAND_BORDER },
                '&:hover fieldset': { borderColor: '#94a3b8' },
                '&.Mui-focused fieldset': { borderColor: BRAND_PRIMARY },
              },
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={loading || !input.trim()}
            sx={{
              width: 40, height: 40,
              background: input.trim() && !loading
                ? `linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #2563eb 100%)`
                : BRAND_SURFACE,
              color: input.trim() && !loading ? '#ffffff' : BRAND_MUTED,
              borderRadius: '8px',
              border: `1px solid ${BRAND_BORDER}`,
              flexShrink: 0,
              transition: 'all 0.15s ease',
              '&:hover': {
                background: input.trim() && !loading
                  ? '#1e40af'
                  : BRAND_SURFACE,
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
};

export default AIChatbotWidget;
