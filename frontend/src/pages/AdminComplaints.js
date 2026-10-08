import React, { useEffect, useState } from 'react';
import {
  Filter,
  Eye,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Inbox,
  User,
  Phone,
  Mail,
  Calendar,
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

const priorityBadge = (p) => (
  <span className={`badge badge-${p?.toLowerCase()}`}>{p}</span>
);

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Closed'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const CATEGORIES = [
  '',
  'Network Issue',
  'Billing Problem',
  'Poor Signal',
  'Internet Speed',
  'Customer Service',
  'Roaming Issue',
  'SIM Card Problem',
  'Other',
];

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ status: '', category: '', priority: '' });
  const [updateForm, setUpdateForm] = useState({ status: '', priority: '', adminNote: '' });
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchComplaints = (f = filters) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (f.status) params.set('status', f.status);
    if (f.category) params.set('category', f.category);
    if (f.priority) params.set('priority', f.priority);

    api
      .get(`/admin/complaints?${params}`)
      .then((res) => {
        setComplaints(res.data.complaints);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const openModal = (c) => {
    setSelected(c);
    setUpdateForm({
      status: c.status,
      priority: c.priority,
      adminNote: c.adminNote || '',
    });
    setMsg('');
  };

  const handleUpdate = async () => {
    setUpdating(true);
    setMsg('');
    try {
      await api.patch(`/admin/complaints/${selected._id}`, updateForm);
      setMsg('Changes updated successfully.');
      fetchComplaints();
      setTimeout(() => setSelected(null), 1200);
    } catch (err) {
      setMsg('Failed to update: ' + (err.response?.data?.message || 'Server error'));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this complaint record from the database?')) return;
    try {
      await api.delete(`/admin/complaints/${id}`);
      setSelected(null);
      fetchComplaints();
    } catch {
      alert('Delete failed.');
    }
  };

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    fetchComplaints(newFilters);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Complaint Management</h1>
        <p>
          {complaints.length} complaint{complaints.length !== 1 ? 's' : ''} matching operational criteria
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--slate-500)', fontSize: 13, fontWeight: 600 }}>
            <Filter size={15} /> Filters:
          </div>

          <select
            className="form-control"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            style={{ width: 160 }}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            className="form-control"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            style={{ width: 180 }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c || 'All Categories'}
              </option>
            ))}
          </select>

          <select
            className="form-control"
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            style={{ width: 150 }}
          >
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              const reset = { status: '', category: '', priority: '' };
              setFilters(reset);
              fetchComplaints(reset);
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <span className="spinner spinner-dark" style={{ width: 32, height: 32 }} />
          </div>
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Inbox size={26} />
            </div>
            <h3>No complaints match criteria</h3>
            <p>Try resetting your filter parameters or checking back later.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Subscriber</th>
                  <th>Title & Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>
                        {c.user?.name || 'Anonymous User'}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>
                        {c.user?.email || '—'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>{c.category}</div>
                    </td>
                    <td>{priorityBadge(c.priority)}</td>
                    <td>{statusBadge(c.status)}</td>
                    <td style={{ fontSize: 13, color: 'var(--slate-500)' }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openModal(c)}>
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Review & Update Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: 17 }}>Manage Ticket #{selected._id?.slice(-6).toUpperCase()}</h3>
                <span style={{ fontSize: 12, color: 'var(--slate-500)' }}>
                  Submitted on {new Date(selected.createdAt).toLocaleString()}
                </span>
              </div>
              <button className="btn-close" onClick={() => setSelected(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {msg && (
                <div
                  className={`alert-banner ${
                    msg.includes('successfully') ? 'alert-banner-success' : 'alert-banner-error'
                  }`}
                >
                  {msg.includes('successfully') ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{msg}</span>
                </div>
              )}

              {/* Subscriber details card */}
              <div
                style={{
                  background: 'var(--slate-50)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: 14,
                  marginBottom: 18,
                  fontSize: 13,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 12,
                }}
              >
                <div>
                  <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: 11, textTransform: 'uppercase', fontWeight: 700 }}>
                    Subscriber
                  </span>
                  <strong>{selected.user?.name}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: 11, textTransform: 'uppercase', fontWeight: 700 }}>
                    Email
                  </span>
                  <span>{selected.user?.email}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: 11, textTransform: 'uppercase', fontWeight: 700 }}>
                    Phone
                  </span>
                  <span>{selected.user?.phone || 'Not provided'}</span>
                </div>
              </div>

              <h2 style={{ fontSize: 18, marginBottom: 8 }}>{selected.title}</h2>
              <div
                style={{
                  padding: 14,
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 14,
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                {selected.description}
              </div>

              {/* Status & Priority Editor */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 14,
                  marginBottom: 16,
                }}
              >
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Update Status</label>
                  <select
                    className="form-control"
                    value={updateForm.status}
                    onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Update Priority</label>
                  <select
                    className="form-control"
                    value={updateForm.priority}
                    onChange={(e) => setUpdateForm({ ...updateForm, priority: e.target.value })}
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Engineering & Support Note (Visible to subscriber)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="e.g. Technician dispatched to tower sector 4; expected fix within 2 hours."
                  value={updateForm.adminNote}
                  onChange={(e) => setUpdateForm({ ...updateForm, adminNote: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-danger-outline btn-sm"
                onClick={() => handleDelete(selected._id)}
              >
                <Trash2 size={14} /> Delete
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => setSelected(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleUpdate}
                disabled={updating}
              >
                {updating ? <span className="spinner" /> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
