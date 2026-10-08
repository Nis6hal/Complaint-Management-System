import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, FilePlus2, ClipboardList, BarChart3,
  Users, LogOut, Radio, BrainCircuit, User, ExternalLink
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const UserNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Submit Complaint", icon: FilePlus2, path: "/complaints/new" },
  { label: "My Complaints", icon: ClipboardList, path: "/complaints" },
  { label: "Profile", icon: User, path: "/profile" },
];

const AdminNav = [
  { label: "Overview", icon: BarChart3, path: "/admin" },
  { label: "AI Intelligence", icon: BrainCircuit, path: "/ai-analytics" },
  { label: "All Complaints", icon: ClipboardList, path: "/admin/complaints" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Profile", icon: User, path: "/profile" },
];

export default function Sidebar({ menuOpen, onMenuClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const closeRef = useRef(onMenuClose);

  useEffect(() => { closeRef.current = onMenuClose; });

  // Close sidebar on navigation (mobile)
  useEffect(() => { closeRef.current(); }, [location.pathname]);

  if (!user) return null;

  const navItems = user.role === "admin" ? AdminNav : UserNav;
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleNav = (path) => { navigate(path); };

  return (
    <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
      <div className="sidebar-logo">
        <div className="sidebar-brand-icon">
          <Radio size={20} />
        </div>
        <div>
          <h2>TelcoResolve</h2>
          <span>{user.role === "admin" ? "Operations NOC" : "Subscriber Portal"}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => handleNav(item.path)}
            >
              <span className="nav-icon"><Icon size={18} /></span>
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="nav-section-label" style={{ marginTop: 12 }}>Public</div>
        <Link to="/" className="nav-item" style={{ color: "var(--slate-400)" }}>
          <span className="nav-icon"><ExternalLink size={17} /></span>
          <span>Home / Landing</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{initials}</div>
          <div className="user-info">
            <span className="user-name" title={user.name}>{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => { logout(); navigate("/login"); }}
          style={{ width: "100%", color: "#f87171", backgroundColor: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.2)" }}
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
