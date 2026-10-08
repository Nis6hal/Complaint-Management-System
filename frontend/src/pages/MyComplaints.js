import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Eye,
  Trash2,
  X,
  Inbox,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Filter,
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

export default function MyComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState('All');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchComplaints = () => {
    setLoading(true);
    api
      .get('/complaints')
      .then((res) => {
        setComplaints(res.data.complaints);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and delete this complaint?')) return;
    setDeleting(true);
    try {
      await api.delete(`/complaints/${id}`);
      setSelected(null);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete complaint.');
    } finally {
      setDeleting(false);
    }
  };

  const displayedComplaints =
    filteredStatus === 'All'
      ? complaints
      : complaints.filter((c) => c.status === filteredStatus);

  // Helper for Stepper
  const getStepClass = (stepName, currentStatus) => {
    const order = ['Pending', 'In Progress', 'Resolved', 'Closed'];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepName);

    if (currentStatus === stepName) return 'current';
    if (currentIndex > stepIndex) return 'completed';
    return '';
  };

  return (
    <div>
      <div
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1>My Complaints</h1>
          <p>
            {complaints.length} ticket{complaints.length !== 1 ? 's' : ''} submitted to network operations
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/complaints/new')}>
          <PlusCircle size={16} /> New Complaint
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['All', 'Pending', 'In Progress', 'Resolved', 'Closed'].map((st) => (
          <button
            key={st}
            className={`btn btn-sm ${filteredStatus === st ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilteredStatus(st)}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <span className="spinner spinner-dark" style={{ width: 32, height: 32 }} />
          </div>
        ) : displayedComplaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Inbox size={26} />
            </div>
            <h3>No complaints found</h3>
            <p>
              {filteredStatus === 'All'
                ? "You haven't submitted any complaints yet."
                : `No complaints currently marked as "${filteredStatus}".`}
            </p>
            {filteredStatus === 'All' && (
              <button
                className="btn btn-primary"
                style={{ marginTop: 16 }}
                onClick={() => navigate('/complaints/new')}
              >
                <PlusCircle size={15} /> Submit Complaint
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title & Description</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Submitted Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedComplaints.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{c.title}</div>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--slate-500)',
                          maxWidth: 320,
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
                      <div style={{ display: 'inline-flex', gap: 8 }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setSelected(c)}
                        >
                          <Eye size={14} /> View
                        </button>
                        {c.status === 'Pending' && (
                          <button
                            className="btn btn-danger-outline btn-sm"
                            onClick={() => handleDelete(c._id)}
                            disabled={deleting}
                            title="Cancel pending complaint"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complaint Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: 17 }}>Ticket #{selected._id?.slice(-6).toUpperCase()}</h3>
                <span style={{ fontSize: 12, color: 'var(--slate-500)' }}>
                  Submitted on {new Date(selected.createdAt).toLocaleString()}
                </span>
              </div>
              <button className="btn-close" onClick={() => setSelected(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <h2 style={{ fontSize: 18, marginBottom: 12 }}>{selected.title}</h2>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
                {statusBadge(selected.status)}
                {priorityBadge(selected.priority)}
                <span className="badge badge-low">{selected.category}</span>
              </div>

              {/* Visual Progress Stepper */}
              <div style={{ margin: '24px 0 20px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--slate-500)' }}>
                  Resolution Lifecycle
                </span>
                <div className="timeline-stepper">
                  {['Pending', 'In Progress', 'Resolved', 'Closed'].map((step, idx) => (
                    <div key={step} className={`timeline-step ${getStepClass(step, selected.status)}`}>
                      <div className="timeline-step-circle">{idx + 1}</div>
                      <span className="timeline-step-title">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--slate-500)', marginBottom: 6 }}>
                  Issue Description
                </h4>
                <div
                  style={{
                    padding: 14,
                    background: 'var(--slate-50)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: 'var(--slate-800)',
                  }}
                >
                  {selected.description}
                </div>
              </div>

              {/* Admin Note Box */}
              {selected.adminNote && (
                <div
                  style={{
                    padding: 16,
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <strong style={{ fontSize: 12, color: '#1e40af', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <CheckCircle2 size={15} /> Support & Engineer Note
                  </strong>
                  <p style={{ fontSize: 14, color: '#1e3a8a', lineHeight: 1.5 }}>
                    {selected.adminNote}
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {selected.status === 'Pending' && (
                <button
                  className="btn btn-danger-outline btn-sm"
                  onClick={() => handleDelete(selected._id)}
                  disabled={deleting}
                >
                  <Trash2 size={14} /> Cancel Ticket
                </button>
              )}
              <button className="btn btn-outline btn-sm" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
