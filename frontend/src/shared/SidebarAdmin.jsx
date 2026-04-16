import React from "react";
import "../styles/admin.css";
// assets
import logo from '../assets/images/logo.jpeg';

export default function SidebarAdmin({ active, onChange, tabs, open = false, setOpen = () => {} }) {

  return (
    <>
      {/* backdrop when open (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-900"
          onClick={() => setOpen(false)}
        />
      )}
      <div className={`sidebar-admin fixed left-0 top-0 h-full transform transition-transform duration-300 ${open ? 'opened' : 'closed'} md:translate-x-0 z-[1100]`}>
        {/* Header / Logo */}
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="brand-logo h-10 w-10 object-contain" />
          <div className="brand-text">
            <h2>Admin</h2>
            <p>Bibliothèque UAC</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="sidebar-menu">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`sidebar-item ${active === tab.id ? "active" : ""}`}
              onClick={() => {
                onChange(tab.id);
                setOpen(false);
              }}
            >
              <span className="icon">{tab.icon}</span>
              <span className="label">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <small className="muted">v1.0 — local</small>
        </div>
      </div>
    </>
  );
}
