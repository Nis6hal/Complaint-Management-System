import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Radio,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  Headphones,
  FileText,
  Activity,
  CheckCircle2,
  Wifi,
  Smartphone,
  CreditCard,
  Globe2,
  Layers,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartComplaint = () => {
    if (user) {
      navigate('/complaints/new');
    } else {
      navigate('/register');
    }
  };

  const handleTrackComplaints = () => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Top Navbar */}
      <header className="landing-navbar">
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <div className="landing-brand-icon">
              <Radio size={22} />
            </div>
            <span className="landing-brand-text">TelcoResolve</span>
          </div>

          <nav className="landing-nav-links">
            <a href="#services">Services</a>
            <a href="#workflow">Workflow</a>
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
              >
                Go to Dashboard <ArrowRight size={15} />
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Sign In
                </Link>
                <button className="btn btn-primary btn-sm" onClick={handleStartComplaint}>
                  File Complaint
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-badge">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          <span>Operational Telecom Issue Tracking Platform</span>
        </div>

        <h1>Transparent, Trackable Telecom Dispute & Issue Management</h1>
        <p>
          Log fiber outages, mobile network issues, billing disputes, and landline faults with direct ticket tracking,
          AI-assisted classification, and end-to-end status visibility.
        </p>

        <div className="landing-hero-cta">
          <button className="btn btn-primary btn-lg" onClick={handleStartComplaint}>
            Submit a Complaint <ArrowRight size={18} />
          </button>
          <button className="btn btn-outline btn-lg" onClick={handleTrackComplaints}>
            Track Existing Tickets
          </button>
        </div>

        {/* Supported Service Categories */}
        <div
          id="services"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            marginTop: 48,
            flexWrap: 'wrap',
          }}
        >
          <div className="badge badge-medium" style={{ padding: '8px 16px', fontSize: 13, gap: 8 }}>
            <Wifi size={15} /> FTTH Fiber & Broadband
          </div>
          <div className="badge badge-medium" style={{ padding: '8px 16px', fontSize: 13, gap: 8 }}>
            <Smartphone size={15} /> Mobile Network & 4G/5G
          </div>
          <div className="badge badge-medium" style={{ padding: '8px 16px', fontSize: 13, gap: 8 }}>
            <CreditCard size={15} /> Billing & Tariff Disputes
          </div>
          <div className="badge badge-medium" style={{ padding: '8px 16px', fontSize: 13, gap: 8 }}>
            <Globe2 size={15} /> SIM, Landline & Roaming
          </div>
        </div>
      </section>

      {/* System Operational Pillars (Replaced fake numbers with real operational pillars) */}
      <section className="landing-metrics">
        <div className="metrics-inner">
          <div className="metric-box">
            <h3 style={{ fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Layers size={22} color="#60a5fa" /> Direct Triage
            </h3>
            <p>Categorized logging by service type, severity, and subscriber contact</p>
          </div>
          <div className="metric-box">
            <h3 style={{ fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Zap size={22} color="#f59e0b" /> AI Classification
            </h3>
            <p>Integrated NLP assistant to diagnose and pre-fill complaint tickets</p>
          </div>
          <div className="metric-box">
            <h3 style={{ fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Activity size={22} color="#34d399" /> Stage Tracking
            </h3>
            <p>Real-time lifecycle transitions: Pending, In Progress, Resolved</p>
          </div>
          <div className="metric-box">
            <h3 style={{ fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <ShieldCheck size={22} color="#818cf8" /> Engineer Notes
            </h3>
            <p>Full audit trail with transparent administrator & technician remarks</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="workflow" className="landing-steps">
        <div className="section-header-center">
          <h2>Resolution Workflow</h2>
          <p>A structured, transparent 3-step process from issue submission to resolution.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">1</span>
            <h3>Submit Details</h3>
            <p>
              Provide your problem description, service category, and priority level. You can also describe it to the AI assistant for instant ticket draft generation.
            </p>
          </div>
          <div className="step-card">
            <span className="step-number">2</span>
            <h3>Admin Triage & Assignment</h3>
            <p>
              Operations team reviews the incoming complaint, sets priority, adjusts ticket status, and enters internal notes and diagnostic updates.
            </p>
          </div>
          <div className="step-card">
            <span className="step-number">3</span>
            <h3>Resolution & Verification</h3>
            <p>
              Follow ticket progress in your personal portal. Once resolved, view the closure summary and technician explanation directly on your dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="landing-features">
        <div className="landing-section-inner">
          <div className="section-header-center">
            <h2>Core Platform Features</h2>
            <p>Designed with standard telecom support operations in mind.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-box">
                <Activity size={24} />
              </div>
              <h3>Lifecycle Stepper</h3>
              <p>
                Visual stage progression keeps subscribers informed at each phase of the ticket without needing manual phone follow-ups.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <FileText size={24} />
              </div>
              <h3>Historical Audit Record</h3>
              <p>
                Past complaints are archived permanently in your account for historical reference, invoice adjustments, and auditing.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <Search size={24} />
              </div>
              <h3>Priority & Filter Tools</h3>
              <p>
                Admins and subscribers can filter tickets by status (Pending, In Progress, Resolved) and priority (Low, Medium, High, Critical).
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <ShieldCheck size={24} />
              </div>
              <h3>Role-Based Access</h3>
              <p>
                Strict separation between subscriber portal and administrative console ensures secure handling of user records.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <Headphones size={24} />
              </div>
              <h3>Technician Resolution Notes</h3>
              <p>
                Detailed technical remarks and resolution timestamps attached directly to each ticket record upon completion.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <Clock size={24} />
              </div>
              <h3>Account Self-Service</h3>
              <p>
                Manage account access and recover forgotten passwords using tokenized verification workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" style={{ padding: '70px 24px', maxWidth: 880, margin: '0 auto', width: '100%' }}>
        <div className="section-header-center">
          <h2>Frequently Asked Questions</h2>
          <p>Common questions about using the ticket portal.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={18} color="#2563eb" /> How do priority levels work?
            </h4>
            <p style={{ color: 'var(--slate-600)', fontSize: 14 }}>
              When submitting, you can designate an issue as Low, Medium, High, or Critical. Critical tickets appear prominently in the administrator triage queue.
            </p>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={18} color="#2563eb" /> How can I check status on past tickets?
            </h4>
            <p style={{ color: 'var(--slate-600)', fontSize: 14 }}>
              Sign in to your account and navigate to "My Complaints". You can filter by status and view the full resolution history and remarks for any ticket.
            </p>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={18} color="#2563eb" /> Can I reset my password if I forget it?
            </h4>
            <p style={{ color: 'var(--slate-600)', fontSize: 14 }}>
              Yes. Visit the Sign In page and click "Forgot password?". Enter your registered email address to receive a secure token to reset your credentials.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section style={{ padding: '0 24px 70px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px 36px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 24,
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div>
            <h2 style={{ color: '#ffffff', fontSize: 26, marginBottom: 8 }}>Manage your telecom tickets with ease</h2>
            <p style={{ color: 'var(--slate-400)', fontSize: 15, maxWidth: 560 }}>
              A clean, open complaint tracking system with real-time lifecycle updates and admin oversight.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary btn-lg" onClick={handleStartComplaint}>
              File a Complaint
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Radio size={18} color="#2563eb" />
            <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>TelcoResolve</span>
            <span style={{ color: 'var(--slate-400)' }}>— Telecom Complaint Management System</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/login" style={{ color: 'var(--slate-600)' }}>Sign In</Link>
            <Link to="/register" style={{ color: 'var(--slate-600)' }}>Register</Link>
            <Link to="/forgot-password" style={{ color: 'var(--slate-600)' }}>Reset Password</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
