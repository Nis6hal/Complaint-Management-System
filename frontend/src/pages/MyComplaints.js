import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const statusBadge = (s) => {
  const map = { Pending: 'badge-pending', 'In Progress': 'badge-progress', Resolved: 'badge-resolved', Closed: 'badge-closed' };
  return <span className={`badge ${map[s] || ''}`}>{s}</span>;
};

const priorityBadge = (p) => (
  <span className={`badge badge-${p?.toLowerCase()}`}>{p}</span>
);

export default function MyComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchComplaints = () => {
    api.get('/complaints').then(res => {
      setComplaints(res.data.complaints);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint?')) return;
    setDeleting(true);
    try {
      await api.delete(`/complaints/${id}`);
      setSelected(null);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>My Complaints</h1>
          <p>{complaints.length} complaint{complaints.length !== 1 ? 's' : ''} submitted</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/complaints/new')}>✏️ New Complaint</button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner spinner-dark" style={{ width: 36, height: 36 }} /></div>
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No complaints yet</h3>
            <p>You haven't submitted any complaints</p>
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
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c._id}>
                    <td data-label="Title" style={{ fontWeight: 500 }}>{c.title}</td>
                    <td data-label="Category" style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.category}</td>
                    <td data-label="Priority">{priorityBadge(c.priority)}</td>
                    <td data-label="Status">{statusBadge(c.status)}</td>
                    <td data-label="Submitted" style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td data-label="Action"><button className="btn btn-outline btn-sm" onClick={() => setSelected(c)}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Complaint Details</h3>
              <button className="btn-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="complaint-detail-header">
                <div>
                  <h2 style={{ fontSize: 18, marginBottom: 8 }}>{selected.title}</h2>
                  <div className="complaint-meta">
                    {statusBadge(selected.status)}
                    {priorityBadge(selected.priority)}
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>#{selected._id.slice(-8).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="responsive-grid-2" style={{ marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 4 }}>Category</div>
                  <div style={{ fontSize: 14 }}>{selected.category}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 4 }}>Submitted</div>
                  <div style={{ fontSize: 14 }}>{new Date(selected.createdAt).toLocaleString()}</div>
                </div>
                {selected.resolvedAt && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 4 }}>Resolved</div>
                    <div style={{ fontSize: 14 }}>{new Date(selected.resolvedAt).toLocaleString()}</div>
                  </div>
                )}
              </div>

              <div className="detail-section">
                <h4>Description</h4>
                <p>{selected.description}</p>
              </div>

              {selected.adminNote && (
                <div className="admin-note-box">
                  <strong>📌 Admin Response</strong>
                  {selected.adminNote}
                </div>
              )}
            </div>
            <div className="modal-footer">
              {selected.status === 'Pending' && (
                <button className="btn btn-danger btn-sm" disabled={deleting} onClick={() => handleDelete(selected._id)}>
                  {deleting ? 'Deleting...' : '🗑️ Delete'}
                </button>
              )}
              <button className="btn btn-outline btn-sm" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
