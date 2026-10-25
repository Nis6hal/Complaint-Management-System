import React, { useState } from 'react';
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
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickTicketId, setQuickTicketId] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(0);

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

  const handleQuickLookup = (e) => {
    e.preventDefault();
    const cleanId = quickTicketId.trim();
    if (!cleanId) return;
    if (user) {
      navigate('/complaints');
    } else {
      navigate(`/login?ticket=${encodeURIComponent(cleanId)}`);
    }
  };

  const faqs = [
    {
      q: 'How does the AI Assistant diagnose telecom complaints?',
      a: 'The system uses an NLP machine learning model combined with telecom support rules to automatically detect issue categories (Fiber Cut, LOS Red, Slow Internet, Billing, SIM VoLTE), predict priority levels, and provide instant troubleshooting guidance before ticket registration.'
    },
    {
      q: 'How do priority levels work?',
      a: 'When submitting, issues are categorized as Low, Medium, High, or Critical. Critical and High priority tickets (such as total fiber cut or network outages) appear immediately at the top of the NOC administrator triage queue with accelerated SLA response times.'
    },
    {
      q: 'How can I check the live progress of my complaint ticket?',
      a: 'Sign in to your account and go to "My Complaints" or your Dashboard. You can also ask the AI Chatbot widget (e.g. "Check status CMP100201") anytime to get real-time status: Pending, In Progress (Field Work Underway), or Resolved.'
    },
    {
      q: 'Can field technicians add notes and resolution details?',
      a: 'Yes. Every ticket includes an engineer audit trail. Once an issue is inspected and fixed, technician notes, cause explanations, and exact resolution timestamps are attached directly to your ticket for full transparency.'
    },
    {
      q: 'Can I reset my password if I forget it?',
      a: 'Yes. Visit the Sign In page and click "Forgot password?". Enter your registered email address to receive a secure token to reset your credentials instantly.'
    }
  ];

  return (
    <div className="landing-page-root">
      {/* Top Navbar */}
      <header className="landing-navbar">
        <div className="landing-nav-inner">
          <div className="landing-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="landing-brand-icon">
              <Radio size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="landing-brand-text">TelcoResolve</span>
              <span style={{ fontSize: 10, color: 'var(--slate-500)', fontWeight: 600, letterSpacing: '0.04em' }}>
                SUPPORT PORTAL
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="landing-nav-links">
            <a href="#services">Services</a>
            <a href="#workflow">Workflow</a>
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
          </nav>

          {/* Desktop Actions */}
          <div className="landing-nav-actions">
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

          {/* Mobile Hamburger Button */}
          <button
            className="landing-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="landing-mobile-menu">
            <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="#workflow" onClick={() => setMobileMenuOpen(false)}>Workflow</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <div className="landing-mobile-menu-buttons">
              {user ? (
                <button
                  className="btn btn-primary btn-md"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => { setMobileMenuOpen(false); navigate(user.role === 'admin' ? '/admin' : '/dashboard'); }}
                >
                  Go to Dashboard <ArrowRight size={16} />
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-outline btn-md"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <button
                    className="btn btn-primary btn-md"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => { setMobileMenuOpen(false); handleStartComplaint(); }}
                  >
                    File Complaint
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-badge">
          <span className="pulse-green-dot" />
          <span>Operational Telecom Issue & Dispute Management</span>
        </div>

        <h1 className="landing-hero-title">
          Transparent, Fast Telecom Issue & Dispute Management
        </h1>
        <p className="landing-hero-desc">
          Log FTTH fiber outages, mobile network issues, billing disputes, and landline faults with 
          AI-assisted classification and transparent NOC resolution tracking.
        </p>

        <div className="landing-hero-cta">
          <button className="btn btn-primary btn-lg" onClick={handleStartComplaint}>
            Submit a Complaint <ArrowRight size={18} />
          </button>
          <button className="btn btn-outline btn-lg" onClick={handleTrackComplaints}>
            <Search size={18} /> Track Existing Tickets
          </button>
        </div>

        {/* Quick Ticket Tracker Bar */}
        <div className="quick-tracker-wrapper">
          <form className="quick-tracker-card" onSubmit={handleQuickLookup}>
            <div className="quick-tracker-input-group">
              <Search size={18} color="var(--slate-400)" />
              <input
                type="text"
                placeholder="Enter Ticket ID (e.g. CMP100201)..."
                value={quickTicketId}
                onChange={(e) => setQuickTicketId(e.target.value)}
                className="quick-tracker-input"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm quick-tracker-btn">
              Track Status
            </button>
          </form>
          <div className="quick-tracker-hint">
            <Bot size={14} color="#2563eb" />
            <span>Need instant help? Use the AI Assistant in the bottom right corner.</span>
          </div>
        </div>

        {/* Supported Service Categories */}
        <div id="services" className="landing-services-pills">
          <div className="service-pill">
            <Wifi size={15} color="#2563eb" /> FTTH Fiber & Broadband
          </div>
          <div className="service-pill">
            <Smartphone size={15} color="#0284c7" /> Mobile Network & 4G/5G
          </div>
          <div className="service-pill">
            <CreditCard size={15} color="#d97706" /> Billing & Recharge Disputes
          </div>
          <div className="service-pill">
            <Globe2 size={15} color="#16a34a" /> SIM, NetTV & Landline
          </div>
        </div>
      </section>

      {/* Operational Pillars */}
      <section className="landing-metrics">
        <div className="metrics-inner">
          <div className="metric-box">
            <div className="metric-icon-box">
              <Layers size={22} color="#60a5fa" />
            </div>
            <h3>Direct Triage</h3>
            <p>Categorized logging by service type, severity, and subscriber phone</p>
          </div>
          <div className="metric-box">
            <div className="metric-icon-box">
              <Zap size={22} color="#f59e0b" />
            </div>
            <h3>AI Classification</h3>
            <p>NLP model to auto-categorize complaints and suggest troubleshooting steps</p>
          </div>
          <div className="metric-box">
            <div className="metric-icon-box">
              <Activity size={22} color="#34d399" />
            </div>
            <h3>Stage Tracking</h3>
            <p>Live status progression: Pending, In Progress, Resolved with 100% visibility</p>
          </div>
          <div className="metric-box">
            <div className="metric-icon-box">
              <ShieldCheck size={22} color="#a78bfa" />
            </div>
            <h3>Engineer Notes</h3>
            <p>Full audit trail with transparent administrator & field technician remarks</p>
          </div>
        </div>
      </section>

      {/* Resolution Workflow */}
      <section id="workflow" className="landing-steps">
        <div className="section-header-center">
          <h2>Resolution Workflow</h2>
          <p>A structured, transparent 3-step process from issue submission to field resolution.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">01</span>
            <h3>Submit Details & AI Triage</h3>
            <p>
              Provide your problem description or talk directly with the AI Assistant. The system analyzes symptoms, 
              detects department, and checks for existing duplicate tickets.
            </p>
          </div>
          <div className="step-card">
            <span className="step-number">02</span>
            <h3>NOC Triage & Assignment</h3>
            <p>
              Operations and NOC team reviews the ticket, verifies priority, assigns appropriate field engineers, 
              and documents initial diagnostic remarks.
            </p>
          </div>
          <div className="step-card">
            <span className="step-number">03</span>
            <h3>Resolution & Verification</h3>
            <p>
              Track progress live on your dashboard. Once resolved, view the closure summary, cause explanation, 
              and technician remarks directly on your ticket.
            </p>
          </div>
        </div>
      </section>

      {/* Core Platform Features */}
      <section id="features" className="landing-features">
        <div className="landing-section-inner">
          <div className="section-header-center">
            <h2>Core Platform Features</h2>
            <p>Engineered to handle enterprise telecom support operations with ease.</p>
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
                <Zap size={24} />
              </div>
              <h3>AI-Powered NLP Engine</h3>
              <p>
                Integrated machine learning categorizes technical issues and drafts official tickets with suggested fixes.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <FileText size={24} />
              </div>
              <h3>Permanent Audit Records</h3>
              <p>
                All past complaints are stored securely in your account for historical reference, bill adjustments, and auditing.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <Search size={24} />
              </div>
              <h3>Priority & Status Filtering</h3>
              <p>
                Admins and subscribers can filter tickets by status (Pending, In Progress, Resolved) and priority (Low, Medium, High, Critical).
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <Headphones size={24} />
              </div>
              <h3>Technician Resolution Remarks</h3>
              <p>
                Detailed technical remarks and resolution timestamps attached directly to each ticket record upon completion.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <ShieldCheck size={24} />
              </div>
              <h3>Role-Based Security</h3>
              <p>
                Strict separation between subscriber portal and administrative console ensures secure handling of user records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="landing-faq-section">
        <div className="section-header-center">
          <h2>Frequently Asked Questions</h2>
          <p>Common questions about using the ticket portal and resolution process.</p>
        </div>

        <div className="faq-accordion-list">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className={`faq-accordion-item ${isOpen ? 'active' : ''}`}
                onClick={() => setExpandedFaq(isOpen ? null : idx)}
              >
                <div className="faq-accordion-question">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle2 size={18} color={isOpen ? '#2563eb' : '#64748b'} />
                    <span style={{ fontWeight: 600, fontSize: 15, color: isOpen ? 'var(--brand-primary)' : 'var(--slate-800)' }}>
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`faq-chevron ${isOpen ? 'rotated' : ''}`}
                  />
                </div>
                {isOpen && (
                  <div className="faq-accordion-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Box */}
      <section className="landing-cta-section">
        <div className="landing-cta-card">
          <div className="landing-cta-content">
            <h2>Manage your telecom tickets with ease</h2>
            <p>
              A clean, open complaint tracking system with real-time lifecycle updates, NOC oversight, and intelligent AI assistance.
            </p>
          </div>
          <div className="landing-cta-actions">
            <button className="btn btn-primary btn-lg" onClick={handleStartComplaint}>
              File a Complaint <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Radio size={18} color="#2563eb" />
            <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>TelcoResolve</span>
            <span style={{ color: 'var(--slate-400)' }}>— Telecom Complaint Management System</span>
          </div>
          <div className="footer-links">
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
            <Link to="/forgot-password">Reset Password</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
