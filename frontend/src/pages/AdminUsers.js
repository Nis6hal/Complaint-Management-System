import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/users').then(res => {
      setUsers(res.data.users);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Registered Users</h1>
        <p>{users.length} user{users.length !== 1 ? 's' : ''} registered</p>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner spinner-dark" style={{ width: 36, height: 36 }} /></div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No users yet</h3>
            <p>Users will appear here once they register</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Registered</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const initials = u.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
                  return (
                    <tr
                    key={u._id}
                    className="clickable-row"
                    onClick={() => navigate(`/admin/users/${u._id}`)}
                    title="View user details"
                    style={{ cursor: 'pointer' }}
                  >
                      <td data-label="User">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                            {initials}
                          </div>
                          <span style={{ fontWeight: 500 }}>{u.name}</span>
                        </div>
                      </td>
                      <td data-label="Email" style={{ fontSize: 13 }}>{u.email}</td>
                      <td data-label="Phone" style={{ fontSize: 13, color: 'var(--text-muted)' }}>{u.phone || '—'}</td>
                      <td data-label="Registered" style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
