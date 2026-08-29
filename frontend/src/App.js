import React, { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ComplaintForm from "./pages/ComplaintForm";
import MyComplaints from "./pages/MyComplaints";
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/AdminComplaints";
import AdminComplaintForm from "./pages/AdminComplaintForm";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetail from "./pages/AdminUserDetail";
import Profile from "./pages/Profile";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Route guard for logged-in users
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          className="spinner spinner-dark"
          style={{ width: 36, height: 36 }}
        />
      </div>
    );
  return user ? children : <Navigate to="/login" replace />;
};

// Route guard for admins only
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
};

import AIChatbotWidget from "./components/AIChatbotWidget";
import AIDashboardPage from "./pages/AIDashboardPage";

// Layout wrapper with header and sidebar
const AppLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  return (
    <>
      <Header menuOpen={menuOpen} onMenuToggle={toggleMenu} />
      <div className="page-wrapper">
        <Sidebar menuOpen={menuOpen} onMenuClose={closeMenu} />
        <main className="main-content">{children}</main>
      </div>
      <AIChatbotWidget />
    </>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin and User routes */}
      <Route
        path="/ai-analytics"
        element={
          <AdminRoute>
            <AppLayout>
              <AIDashboardPage />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/complaints/new"
        element={
          <PrivateRoute>
            <AppLayout>
              <ComplaintForm />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/complaints"
        element={
          <PrivateRoute>
            <AppLayout>
              <MyComplaints />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </PrivateRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/complaints"
        element={
          <AdminRoute>
            <AppLayout>
              <AdminComplaints />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/complaints/new"
        element={
          <AdminRoute>
            <AppLayout>
              <AdminComplaintForm />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AppLayout>
              <AdminUsers />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users/:id"
        element={
          <AdminRoute>
            <AppLayout>
              <AdminUserDetail />
            </AppLayout>
          </AdminRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
