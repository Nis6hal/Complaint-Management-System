import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Inbox,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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

const priorityBadge = (p) => (
  <span className={`badge badge-${p?.toLowerCase()}`}>{p}</span>
);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/complaints')
      .then((res) => {
        setComplaints(res.data.complaints);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'Pending').length,
    inProgress: complaints.filter((c) => c.status === 'In Progress').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
  };

  const recent = complaints.slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p>Here is the live status and summary of your telecom support tickets</p>
      </div>

      {/* Metrics Grid */}
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
      </div>

      {/* Quick Action Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => navigate('/complaints/new')}>
          <PlusCircle size={16} /> File New Complaint
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/complaints')}>
          View All Tickets ({complaints.length})
        </button>
      </div>

      {/* Recent Complaints Table Card */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <div>
            <h3 style={{ fontSize: 16 }}>Recent Tickets</h3>
            <span style={{ fontSize: 13, color: 'var(--slate-500)' }}>
              Latest updates on your reported issues
            </span>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/complaints')}>
            View all <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <span className="spinner spinner-dark" />
          </div>
        ) : recent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Inbox size={26} />
            </div>
            <h3>No complaints filed yet</h3>
            <p>If you are experiencing slow internet, signal drops, or billing errors, let our team know.</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: 18 }}
              onClick={() => navigate('/complaints/new')}
            >
              <PlusCircle size={15} /> File Your First Complaint
            </button>
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
                  <th>Submitted</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{c.title}</div>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--slate-500)',
                          maxWidth: 280,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {c.description}
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>{c.category}</td>
                    <td>{priorityBadge(c.priority)}</td>
                    <td>{statusBadge(c.status)}</td>
                    <td style={{ fontSize: 13, color: 'var(--slate-500)' }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate('/complaints')}
                        title="View details in My Complaints"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
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
