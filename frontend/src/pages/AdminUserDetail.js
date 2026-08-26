import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [complaintCount, setComplaintCount] = useState(0);
  const [latestComplaints, setLatestComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`/admin/users/${id}`)
      .then((res) => {
        setUser(res.data.user);
        setComplaintCount(res.data.complaintCount);
        setLatestComplaints(res.data.latestComplaints);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Unable to load user details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <div className="page-header">
        <h1>User Profile</h1>
        <p>Admin view for user details and activity.</p>
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 20 }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/users')}>
          ← Back to users
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner spinner-dark" style={{ width: 36, height: 36 }} /></div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h3>User not found</h3>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="responsive-grid-2" style={{ marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{user.name}</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{user.email}</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{user.phone || 'No phone provided'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>Role</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{user.role}</div>
                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>Registered {new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Complaint activity</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div className="stat-card">
                  <div className="stat-label">Total complaints</div>
                  <div className="stat-value">{complaintCount}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: 12 }}>Recent Complaints</h3>
              {latestComplaints.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No complaints yet</h3>
                  <p>This user has not submitted any complaints.</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestComplaints.map((c) => (
                        <tr key={c._id}>
                          <td data-label="Title" style={{ fontWeight: 500 }}>{c.title}</td>
                          <td data-label="Category" style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.category}</td>
                          <td data-label="Status" style={{ fontSize: 13 }}>{c.status}</td>
                          <td data-label="Date" style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
