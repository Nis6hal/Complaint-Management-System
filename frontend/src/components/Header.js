import React from "react";
import { Link } from "react-router-dom";
import { Radio, Menu, X } from "lucide-react";

export default function Header({ menuOpen, onMenuToggle }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <Link to="/" className="header-logo">
          <Radio size={22} color="#3b82f6" />
          TelcoResolve
        </Link>
      </div>
      <button
        className="menu-button"
        onClick={onMenuToggle}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}
