import React from 'react';
import { useTranslation } from 'react-i18next';
// assets
import logo from '../assets/images/logo.jpeg';

export default function Sidebar({ active = 'dashboard', onChange = () => {}, tabs = [], open = false, setOpen = () => {} }) {
  const { t } = useTranslation();

  return (
    <>
      {/* backdrop when sidebar open (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-900"
          onClick={() => setOpen(false)}
        />
      )}

      {/* add explicit "opened" class and stronger z-index */}
      <aside className={`sidebar fixed left-0 top-0 h-full transform transition-transform duration-300 ${open ? 'opened' : 'closed'} md:translate-x-0 z-[1100]`}>
        <div className="sidebar-inner">
          {/* Brand / Logo */}
          <div className="brand">
            <div className="logo">
              <img src={logo} alt="Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="brand-title">{t('Bibliothèque')}</div>
              <div className="muted">{t('Cosendai')}</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="nav">
            {tabs.length > 0 ? (
              tabs.map(tab => (
                <button
                  key={tab.id}
                  className={tab.id === active ? 'nav-link active' : 'nav-link'}
                  onClick={() => {
                    onChange(tab.id);
                    setOpen(false); // close menu on selection
                  }}
                >
                  {tab.label}
                </button>
              ))
            ) : (
              <p className="muted">{t('Aucun onglet')}</p>
            )}
          </nav>

          {/* Footer */}
          <div className="sidebar-footer">
            <small className="muted">v1.0 — local</small>
          </div>
        </div>
      </aside>
    </>
  );
}
