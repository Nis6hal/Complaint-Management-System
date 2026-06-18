import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserNav = [
  { label: "Dashboard", icon: "🏠", path: "/dashboard" },
  { label: "New Complaint", icon: "✏️", path: "/complaints/new" },
  { label: "My Complaints", icon: "📋", path: "/complaints" },
];

const AdminNav = [
  { label: "Overview", icon: "📊", path: "/admin" },
  { label: "All Complaints", icon: "📋", path: "/admin/complaints" },
  { label: "Users", icon: "👥", path: "/admin/users" },
  { label: "Profile", icon: "👤", path: "/profile" },
];

export default function Sidebar({ menuOpen, onMenuClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const closeRef = useRef(onMenuClose);

  // keep ref in sync without triggering the route-change effect
  useEffect(() => {
    closeRef.current = onMenuClose;
  });

  // close sidebar on navigation (mobile)
  useEffect(() => {
    closeRef.current();
  }, [location.pathname]);

  if (!user) return null;

  const navItems =
    user.role === "admin"
      ? AdminNav
      : [...UserNav, { label: "Profile", icon: "👤", path: "/profile" }];
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      {/* Overlay backdrop for mobile — closes sidebar on tap */}
      <div
        className={`sidebar-overlay ${menuOpen ? "overlay-visible" : ""}`}
        onClick={onMenuClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-logo">
          <h2>📋 CMS</h2>
          <span>
            {user.role === "admin" ? "Admin Panel" : "Customer Portal"}
          </span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">{initials}</div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <small>{user.role}</small>
            </div>
          </div>
          <button
            className="nav-item"
            onClick={logout}
            style={{ color: "#f87171", marginTop: 4 }}
          >
            <span className="nav-icon">🚪</span> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
