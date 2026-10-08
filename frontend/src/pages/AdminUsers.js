import React, { useEffect, useState } from 'react';
import { Users, Mail, Phone, Calendar, Shield, Search } from 'lucide-react';
import api from '../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/users')
      .then((res) => {
        setUsers(res.data.users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1>Subscriber Directory</h1>
        <p>All registered customers and administrators</p>
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 14 }}>
        <div style={{ maxWidth: 360, position: 'relative' }}>
          <div className="input-icon-wrapper">
            <span className="input-icon-left">
              <Search size={16} />
            </span>
            <input
              className="form-control has-icon-left"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <span className="spinner spinner-dark" style={{ width: 32, height: 32 }} />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Users size={26} />
            </div>
            <h3>No subscribers found</h3>
            <p>Try refining your search keyword.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Subscriber</th>
                  <th>Role</th>
                  <th>Email Address</th>
                  <th>Contact Phone</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const initials = u.name
                    ? u.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'U';
                  const isAdmin = u.role === 'admin';

                  return (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: '50%',
                              background: isAdmin ? 'var(--slate-800)' : 'var(--brand-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ffffff',
                              fontSize: 12,
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{u.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${isAdmin ? 'badge-high' : 'badge-low'}`}>
                          {isAdmin ? 'Admin NOC' : 'Subscriber'}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--slate-700)' }}>{u.email}</td>
                      <td style={{ fontSize: 13, color: 'var(--slate-500)' }}>{u.phone || '—'}</td>
                      <td style={{ fontSize: 13, color: 'var(--slate-500)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
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
