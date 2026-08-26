import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const statusBadge = (s) => {
  const map = { Pending: 'badge-pending', 'In Progress': 'badge-progress', Resolved: 'badge-resolved', Closed: 'badge-closed' };
  return <span className={`badge ${map[s] || ''}`}>{s}</span>;
};

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Closed'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const CATEGORIES = ['', 'Network Issue', 'Billing Problem', 'Poor Signal', 'Internet Speed', 'Customer Service', 'Roaming Issue', 'SIM Card Problem', 'Other'];

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
    api.get(`/admin/complaints?${params}`).then(res => {
      setComplaints(res.data.complaints);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchComplaints(); }, []);

  const openModal = (c) => {
    setSelected(c);
    setUpdateForm({ status: c.status, priority: c.priority, adminNote: c.adminNote || '' });
    setMsg('');
  };

  const handleUpdate = async () => {
    setUpdating(true); setMsg('');
    try {
      await api.patch(`/admin/complaints/${selected._id}`, updateForm);
      setMsg('✅ Updated successfully');
      fetchComplaints();
      setTimeout(() => setSelected(null), 1000);
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Update failed'));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this complaint?')) return;
    try {
      await api.delete(`/admin/complaints/${id}`);
      setSelected(null);
      fetchComplaints();
    } catch {
      alert('Delete failed.');
    }
  };

  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    fetchComplaints(newFilters);
  };

  return (
    <div>
      <div className="page-header">
        <h1>All Complaints</h1>
        <p>{complaints.length} complaint{complaints.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <select className="form-control filter-select" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="form-control filter-select" name="category" value={filters.category} onChange={handleFilterChange}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
          </select>
          <select className="form-control filter-select" name="priority" value={filters.priority} onChange={handleFilterChange}>
            <option value="">All Priorities</option>
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
          <button className="btn btn-outline btn-sm" onClick={() => { setFilters({ status: '', category: '', priority: '' }); fetchComplaints({ status: '', category: '', priority: '' }); }}>
            Clear Filters
          </button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner spinner-dark" style={{ width: 36, height: 36 }} /></div>
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No complaints found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Contact</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c._id}>
                    <td data-label="User">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate(`/admin/users/${c.user?._id}`)}
                        style={{ textAlign: 'left', width: '100%', padding: 0, border: 'none', background: 'transparent' }}
                      >
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{c.user?.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.user?.email}</div>
                      </button>
                    </td>
                    <td data-label="Title" style={{ fontWeight: 500, maxWidth: 180 }}>{c.title}</td>
                    <td data-label="Category" style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.category}</td>
                    <td data-label="Contact" style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.contactPhone || '—'}</td>
                    <td data-label="Priority"><span className={`badge badge-${c.priority?.toLowerCase()}`}>{c.priority}</span></td>
                    <td data-label="Status">{statusBadge(c.status)}</td>
                    <td data-label="Date" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td data-label="Action"><button className="btn btn-outline btn-sm" onClick={() => openModal(c)}>Manage</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Manage Complaint</h3>
              <button className="btn-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{selected.title}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 4, fontSize: 13, color: 'var(--text-muted)' }}>
                  <span>👤 {selected.user?.name} ({selected.user?.email}){selected.user?.phone && ` · 📞 ${selected.user.phone}`}</span>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ padding: '4px 10px', fontSize: 12, height: 28 }}
                    onClick={() => navigate(`/admin/users/${selected.user?._id}`)}
                  >
                    View User Profile
                  </button>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                  📞 {selected.contactPhone || 'No contact phone'}
                  {selected.contactEmail ? ` · ✉️ ${selected.contactEmail}` : ''}
                  {selected.serviceAddress ? ` · 📍 ${selected.serviceAddress}` : ''}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  🗂️ {selected.category} · 🗓️ {new Date(selected.createdAt).toLocaleString()}
                </div>
              </div>

              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 18, fontSize: 14, lineHeight: 1.6 }}>
                {selected.description}
              </div>

              <div className="responsive-grid-2">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Update Status</label>
                  <select className="form-control" value={updateForm.status} onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Update Priority</label>
                  <select className="form-control" value={updateForm.priority} onChange={e => setUpdateForm({ ...updateForm, priority: e.target.value })}>
                    {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 14 }}>
                <label>Admin Note / Response</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Add a note or response visible to the user..."
                  value={updateForm.adminNote}
                  onChange={e => setUpdateForm({ ...updateForm, adminNote: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {msg && <p style={{ fontSize: 13, color: msg.startsWith('✅') ? 'var(--success)' : 'var(--danger)', marginTop: 4 }}>{msg}</p>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selected._id)}>🗑️ Delete</button>
              <button className="btn btn-outline btn-sm" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={handleUpdate} disabled={updating}>
                {updating ? <><span className="spinner" />Saving...</> : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
