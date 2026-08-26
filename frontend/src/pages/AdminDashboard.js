import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(res => {
      setStats(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><span className="spinner spinner-dark" style={{ width: 40, height: 40 }} /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Admin Overview</h1>
        <p>System-wide complaint statistics</p>
      </div>

      {stats && (
        <>
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
            <div className="stat-card">
              <span className="stat-icon">🔒</span>
              <span className="stat-label">Closed</span>
              <span className="stat-value">{stats.closed}</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">👥</span>
              <span className="stat-label">Total Users</span>
              <span className="stat-value" style={{ color: 'var(--blue)' }}>{stats.totalUsers}</span>
            </div>
          </div>

          <div className="responsive-grid-2">
            <div className="card">
              <h3 style={{ fontSize: 15, marginBottom: 16 }}>Complaints by Category</h3>
              {stats.byCategory.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No data</p> : stats.byCategory.map(item => {
                const pct = stats.total ? Math.round((item.count / stats.total) * 100) : 0;
                return (
                  <div key={item._id} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span>{item._id}</span>
                      <span style={{ fontWeight: 600 }}>{item.count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 99 }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'var(--blue)', borderRadius: 99, transition: 'width 0.6s' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card">
              <h3 style={{ fontSize: 15, marginBottom: 16 }}>Complaints by Priority</h3>
              {stats.byPriority.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No data</p> : stats.byPriority.map(item => {
                const colors = { Low: '#64748b', Medium: '#1e40af', High: '#92400e', Critical: '#991b1b' };
                const pct = stats.total ? Math.round((item.count / stats.total) * 100) : 0;
                return (
                  <div key={item._id} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span style={{ color: colors[item._id] || 'inherit', fontWeight: 600 }}>{item._id}</span>
                      <span style={{ fontWeight: 600 }}>{item.count}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 99 }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: colors[item._id] || 'var(--blue)', borderRadius: 99 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" onClick={() => navigate('/admin/complaints')}>
              📋 Manage Complaints
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/admin/users')}>
              👥 View Users
            </button>
          </div>
        </>
      )}
    </div>
  );
}
