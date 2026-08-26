import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <h1>My Profile</h1>
          <p>View your account details and role.</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}>
          Back
        </button>
      </div>

      <div className="card">
        <div className="responsive-grid-2" style={{ alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Account Information</div>
            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Name</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{user.name}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Email</div>
                <div style={{ fontSize: 15 }}>{user.email}</div>
              </div>
              {user.phone && (
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Phone</div>
                  <div style={{ fontSize: 15 }}>{user.phone}</div>
                </div>
              )}
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Role</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{user.role}</div>
              </div>
            </div>
          </div>

          <div style={{ minWidth: 200, padding: 20, background: 'var(--surface2)', borderRadius: 18 }}>
            <h3 style={{ fontSize: 14, marginBottom: 12 }}>Profile quick actions</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Use the sidebar to navigate through complaints, users, and dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
