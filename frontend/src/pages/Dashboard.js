import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const statusBadge = (s) => {
  const map = { Pending: 'badge-pending', 'In Progress': 'badge-progress', Resolved: 'badge-resolved', Closed: 'badge-closed' };
  return <span className={`badge ${map[s] || ''}`}>{s}</span>;
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/complaints').then(res => {
      setComplaints(res.data.complaints);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  const recent = complaints.slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Here's a summary of your complaints</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📋</span>
          <span className="stat-label">Total Complaints</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <span className="stat-label">Pending</span>
          <span className="stat-value" style={{ color: '#92400e' }}>{stats.pending}</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔄</span>
          <span className="stat-label">In Progress</span>
          <span className="stat-value" style={{ color: '#1e40af' }}>{stats.inProgress}</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <span className="stat-label">Resolved</span>
          <span className="stat-value" style={{ color: '#15803d' }}>{stats.resolved}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button className="btn btn-primary" onClick={() => navigate('/complaints/new')}>
          ✏️ Submit New Complaint
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/complaints')}>
          View All Complaints
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16 }}>Recent Complaints</h3>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/complaints')}>View all</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><span className="spinner spinner-dark" /></div>
        ) : recent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No complaints yet</h3>
            <p>Submit your first complaint to get started</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/complaints/new')}>Submit Complaint</button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(c => (
                  <tr key={c._id} style={{ cursor: 'pointer' }} onClick={() => navigate('/complaints')}>
                    <td style={{ fontWeight: 500, maxWidth: 200 }}>{c.title}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.category}</td>
                    <td><span className={`badge badge-${c.priority?.toLowerCase()}`}>{c.priority}</span></td>
                    <td>{statusBadge(c.status)}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
