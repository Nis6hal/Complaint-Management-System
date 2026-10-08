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
  ChevronRight,
  Wifi,
  Smartphone,
  CreditCard,
  Globe2,
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
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#coverage">Coverage</a>
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
          <span>Active Telecom Operations • 24/7 SLA Tracking</span>
        </div>

        <h1>Fast, Accountable Telecom Issue & Dispute Resolution</h1>
        <p>
          Report network drops, broadband latency, billing discrepancies, or SIM issues directly to technical support.
          Track your ticket status in real-time with full transparency.
        </p>

        <div className="landing-hero-cta">
          <button className="btn btn-primary btn-lg" onClick={handleStartComplaint}>
            Submit a Complaint <ArrowRight size={18} />
          </button>
          <button className="btn btn-outline btn-lg" onClick={handleTrackComplaints}>
            Track Existing Ticket
          </button>
        </div>

        {/* Category shortcuts */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            marginTop: 48,
            flexWrap: 'wrap',
          }}
        >
          <div className="badge badge-medium" style={{ padding: '8px 16px', fontSize: 13, gap: 8 }}>
            <Wifi size={15} /> Fiber & Broadband
          </div>
          <div className="badge badge-medium" style={{ padding: '8px 16px', fontSize: 13, gap: 8 }}>
            <Smartphone size={15} /> 4G / 5G Mobile Signal
          </div>
          <div className="badge badge-medium" style={{ padding: '8px 16px', fontSize: 13, gap: 8 }}>
            <CreditCard size={15} /> Billing & Recharge
          </div>
          <div className="badge badge-medium" style={{ padding: '8px 16px', fontSize: 13, gap: 8 }}>
            <Globe2 size={15} /> Roaming & SIM Services
          </div>
        </div>
      </section>

      {/* Real-time Metrics Banner */}
      <section className="landing-metrics">
        <div className="metrics-inner">
          <div className="metric-box">
            <h3>&lt; 2 Hrs</h3>
            <p>Average First-Response SLA</p>
          </div>
          <div className="metric-box">
            <h3>99.4%</h3>
            <p>Verified Ticket Resolution Rate</p>
          </div>
          <div className="metric-box">
            <h3>24 / 7</h3>
            <p>Continuous Network Monitoring</p>
          </div>
          <div className="metric-box">
            <h3>100%</h3>
            <p>Direct Engineer Accountability</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="landing-steps">
        <div className="section-header-center">
          <h2>How It Works</h2>
          <p>A simple, transparent 3-step workflow designed for rapid resolution without phone wait times.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">1</span>
            <h3>Describe the Issue</h3>
            <p>
              Select your complaint category, priority level, and supply necessary details such as service location or
              timestamp in under a minute.
            </p>
          </div>
          <div className="step-card">
            <span className="step-number">2</span>
            <h3>Automated Triage & Review</h3>
            <p>
              Our operations team triages the ticket immediately, assigning dedicated network engineers and noting updates
              directly on your account.
            </p>
          </div>
          <div className="step-card">
            <span className="step-number">3</span>
            <h3>Live Progress & Resolution</h3>
            <p>
              Watch status progress from Pending to In Progress to Resolved, complete with transparent technician notes
              and resolution summaries.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="landing-features">
        <div className="landing-section-inner">
          <div className="section-header-center">
            <h2>Built for Reliability & Speed</h2>
            <p>Every tool you need to stay informed and keep your connection performing at peak standard.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-box">
                <Activity size={24} />
              </div>
              <h3>Live Status Stepper</h3>
              <p>
                No more guessing whether your complaint was received. Track every phase with visual progress milestones.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <FileText size={24} />
              </div>
              <h3>Complete Audit Trail</h3>
              <p>
                Keep a permanent record of all past complaints, technician responses, and billing adjustments for your records.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <Zap size={24} />
              </div>
              <h3>Priority Escalation</h3>
              <p>
                Mark emergency outages or critical line failures with urgent priority for expedited SLA triage.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <ShieldCheck size={24} />
              </div>
              <h3>Secure & Authenticated</h3>
              <p>
                Role-based access protection ensures customer privacy and secure administrative handling of subscriber data.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <Headphones size={24} />
              </div>
              <h3>Admin & Engineering Notes</h3>
              <p>
                Receive detailed technical explanations and next steps directly from network personnel inside your ticket.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <Clock size={24} />
              </div>
              <h3>Password Recovery & Self-Service</h3>
              <p>
                Manage your credentials effortlessly with integrated secure self-service password recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" style={{ padding: '70px 24px', maxWidth: 880, margin: '0 auto', width: '100%' }}>
        <div className="section-header-center">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about logging and tracking complaints.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={18} color="#2563eb" /> How quickly are critical network outages handled?
            </h4>
            <p style={{ color: 'var(--slate-600)', fontSize: 14 }}>
              Complaints categorized as Critical or High priority are immediately routed to our Network Operations Center (NOC) with target response times within 2 hours.
            </p>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={18} color="#2563eb" /> Can I see previous resolved complaints?
            </h4>
            <p style={{ color: 'var(--slate-600)', fontSize: 14 }}>
              Yes. All your complaints remain in your personal "My Complaints" portal, allowing you to review past solutions, dates, and administrative notes at any time.
            </p>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={18} color="#2563eb" /> What if I forgot my account password?
            </h4>
            <p style={{ color: 'var(--slate-600)', fontSize: 14 }}>
              Simply navigate to the Sign In page and select "Forgot password?". Enter your registered email address to quickly generate a secure reset link.
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
            <h2 style={{ color: '#ffffff', fontSize: 28, marginBottom: 8 }}>Ready to get your issue resolved?</h2>
            <p style={{ color: 'var(--slate-400)', fontSize: 15, maxWidth: 560 }}>
              Join thousands of subscribers who rely on TelcoResolve for seamless, verified telecom customer support.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary btn-lg" onClick={handleStartComplaint}>
              File a Complaint Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Radio size={18} color="#2563eb" />
            <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>TelcoResolve Platform</span>
            <span>• High-Availability Telecom Customer Support</span>
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
