import React from 'react';

export default function Header({ menuOpen, onMenuToggle }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-logo">📋 CMS</h1>
      </div>
      <button 
        className="menu-button"
        onClick={onMenuToggle}
        aria-label="Toggle menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>
    </header>
  );
}
