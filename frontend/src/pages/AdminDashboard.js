import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  Lock,
  Users,
  ArrowRight,
  ClipboardList,
} from 'lucide-react';
import api from '../utils/api';

const statusBadge = (s) => {
  const map = {
    Pending: 'badge-pending',
    'In Progress': 'badge-progress',
    Resolved: 'badge-resolved',
    Closed: 'badge-closed',
  };
  return (
    <span className={`badge ${map[s] || ''}`}>
      <span className="badge-dot" />
      {s}
    </span>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/stats')
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <span className="spinner spinner-dark" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Operations Overview</h1>
        <p>Real-time network operational metrics and complaint distribution</p>
      </div>

      {stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Total Complaints</span>
                <span className="stat-value">{stats.total}</span>
              </div>
              <div className="stat-icon-wrapper stat-icon-blue">
                <FileText size={22} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Pending Triage</span>
                <span className="stat-value">{stats.pending}</span>
              </div>
              <div className="stat-icon-wrapper stat-icon-amber">
                <Clock size={22} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">In Progress</span>
                <span className="stat-value">{stats.inProgress}</span>
              </div>
              <div className="stat-icon-wrapper stat-icon-cyan">
                <RefreshCw size={22} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Resolved</span>
                <span className="stat-value">{stats.resolved}</span>
              </div>
              <div className="stat-icon-wrapper stat-icon-emerald">
                <CheckCircle2 size={22} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Closed Archive</span>
                <span className="stat-value">{stats.closed}</span>
              </div>
              <div className="stat-icon-wrapper stat-icon-slate">
                <Lock size={22} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Subscribers</span>
                <span className="stat-value">{stats.totalUsers}</span>
              </div>
              <div className="stat-icon-wrapper stat-icon-blue">
                <Users size={22} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/admin/complaints')}>
              <ClipboardList size={16} /> Manage All Complaints
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/admin/users')}>
              <Users size={16} /> View Subscriber Directory
            </button>
          </div>

          {/* Breakdown cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 20,
            }}
          >
            {/* By Priority */}
            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 16 }}>Complaints by Priority</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stats.byPriority &&
                  stats.byPriority.map((p) => {
                    const pct = stats.total > 0 ? Math.round((p.count / stats.total) * 100) : 0;
                    return (
                      <div key={p._id}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: 4,
                            fontSize: 13,
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{p._id || 'Unspecified'}</span>
                          <span style={{ color: 'var(--slate-500)' }}>
                            {p.count} ({pct}%)
                          </span>
                        </div>
                        <div
                          style={{
                            height: 6,
                            background: 'var(--slate-100)',
                            borderRadius: 'var(--radius-full)',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              backgroundColor:
                                p._id === 'Critical'
                                  ? '#ef4444'
                                  : p._id === 'High'
                                  ? '#f97316'
                                  : p._id === 'Medium'
                                  ? '#3b82f6'
                                  : '#64748b',
                              borderRadius: 'var(--radius-full)',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* By Category */}
            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 16 }}>Complaints by Category</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {stats.byCategory &&
                  stats.byCategory.map((cat) => (
                    <div
                      key={cat._id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        background: 'var(--slate-50)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 13,
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{cat._id || 'General'}</span>
                      <span className="badge badge-medium">{cat.count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
