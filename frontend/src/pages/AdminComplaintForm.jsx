import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const CATEGORIES = [
  'Network Issue', 'Billing Problem', 'Poor Signal',
  'Internet Speed', 'Customer Service', 'Roaming Issue',
  'SIM Card Problem', 'Other',
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export default function AdminComplaintForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [form, setForm] = useState({
    userId: '',
    title: '',
    category: '',
    description: '',
    priority: 'Medium',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    serviceAddress: '',
    preferredContactMethod: 'Phone',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/admin/users').then(res => {
      setUsers(res.data.users);
      setLoadingUsers(false);
    }).catch(() => setLoadingUsers(false));
  }, []);

  useEffect(() => {
    if (users.length > 0 && !form.userId) {
      setForm(prev => ({ ...prev, userId: users[0]._id }));
    }
  }, [users]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.userId) return setError('Please select a user for this complaint.');
    if (!form.contactPhone) return setError('Contact phone is required for this complaint.');
    if (form.description.length < 20) return setError('Description must be at least 20 characters.');
    setSubmitting(true);
    try {
      await api.post('/complaints', { ...form, userId: form.userId });
      setSuccess('✅ Complaint created successfully!');
      setTimeout(() => navigate('/admin/complaints'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedUser = users.find(u => u._id === form.userId);

  return (
    <div>
      <div className="page-header">
        <h1>Add Complaint</h1>
        <p>Create a complaint on behalf of a user</p>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>User *</label>
            <select className="form-control" name="userId" value={form.userId} onChange={handleChange} required disabled={loadingUsers}>
              <option value="">Select a user</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
            {selectedUser && (
              <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                📞 {selectedUser.phone || 'No phone'} · 📧 {selectedUser.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Complaint Title *</label>
            <input className="form-control" name="title" placeholder="Brief summary of the issue" value={form.title} onChange={handleChange} required />
          </div>

          <div className="responsive-grid-2">
            <div className="form-group">
              <label>Category *</label>
              <select className="form-control" name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select className="form-control" name="priority" value={form.priority} onChange={handleChange}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="responsive-grid-2" style={{ marginTop: 8 }}>
            <div className="form-group">
              <label>Contact Name</label>
              <input className="form-control" name="contactName" placeholder="Name on this complaint" value={form.contactName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Contact Phone *</label>
              <input className="form-control" name="contactPhone" placeholder="Phone number for this complaint" value={form.contactPhone} onChange={handleChange} required />
            </div>
          </div>

          <div className="responsive-grid-2" style={{ marginTop: 8 }}>
            <div className="form-group">
              <label>Contact Email</label>
              <input className="form-control" type="email" name="contactEmail" placeholder="Email for this complaint" value={form.contactEmail} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Preferred Contact Method</label>
              <select className="form-control" name="preferredContactMethod" value={form.preferredContactMethod} onChange={handleChange}>
                <option>Phone</option>
                <option>Email</option>
                <option>Any</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 8 }}>
            <label>Service Address</label>
            <input className="form-control" name="serviceAddress" placeholder="Optional address or location" value={form.serviceAddress} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Description * <span style={{ fontWeight: 400, color: '#a0aec0', fontSize: 12 }}>(min 20 characters)</span></label>
            <textarea
              className="form-control"
              name="description"
              placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={handleChange}
              rows={6}
              required
              style={{ resize: 'vertical' }}
            />
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>
              {form.description.length} characters
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <><span className="spinner" />Creating...</> : '📤 Create Complaint'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/complaints')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
