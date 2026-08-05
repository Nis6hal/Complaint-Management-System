import React, { useEffect, useState } from 'react';
import {
  Box, Container, Grid, Paper, Typography, Card, CardContent,
  CircularProgress, Chip, LinearProgress
} from '@mui/material';
const AssessmentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
);
const SpeedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.28-10.43zM10.59 15.41a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z"/></svg>
);
const PrecisionManufacturingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15 13V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2zm-2 0H4V5h9v8z"/></svg>
);
const MapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>
);
import axios from 'axios';

const AIDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/ai/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error('Failed to load AI analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          🤖 AI Intelligence & Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time Machine Learning model predictions, SLA statistics, prediction confidence, and complaint forecasting.
        </Typography>
      </Box>

      {/* Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: '6px solid #1976d2' }}>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2">Total Complaints Analyzed</Typography>
              <Typography variant="h3" fontWeight="bold" color="primary">{data?.totalComplaints || 0}</Typography>
              <Chip label="100% Machine Classified" size="small" color="primary" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: '6px solid #2e7d32' }}>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2">Resolution Rate</Typography>
              <Typography variant="h3" fontWeight="bold" color="success.main">{data?.resolutionRate}%</Typography>
              <LinearProgress variant="determinate" value={data?.resolutionRate || 0} sx={{ mt: 1.5 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: '6px solid #ed6c02' }}>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2">Average SLA Resolution</Typography>
              <Typography variant="h3" fontWeight="bold" color="warning.main">{data?.avgSLAHours}h</Typography>
              <Typography variant="caption" color="text.secondary">Target: &lt; 24.0 Hours</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: '6px solid #9c27b0' }}>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2">AI Complaint Forecast (Tomorrow)</Typography>
              <Typography variant="h3" fontWeight="bold" color="secondary.main">+{data?.forecastTomorrow}</Typography>
              <Chip label="Predictive ML Model" size="small" color="secondary" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Model & Department Breakdown */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              📊 Category Predictions Breakdown
            </Typography>
            {data?.categoryStats?.map((cat, idx) => (
              <Box key={idx} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{cat._id || 'General'}</Typography>
                  <Typography variant="body2" fontWeight="bold">{cat.count} tickets</Typography>
                </Box>
                <LinearProgress variant="determinate" value={Math.min(100, (cat.count / (data.totalComplaints || 1)) * 100)} />
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🏢 Department Routing Statistics
            </Typography>
            {data?.departmentStats?.map((dept, idx) => (
              <Box key={idx} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{dept._id || 'Support'}</Typography>
                  <Typography variant="body2" fontWeight="bold">{dept.count} load</Typography>
                </Box>
                <LinearProgress color="secondary" variant="determinate" value={Math.min(100, (dept.count / (data.totalComplaints || 1)) * 100)} />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AIDashboardPage;
