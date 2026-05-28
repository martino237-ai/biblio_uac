import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../assets/images/logo.jpeg';
 
/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700&display=swap');
 
/* ── Variables ── */
.sb-wrap {
  --sb-w:        240px;
  --sb-bg:       #0f1f55;
  --sb-bg2:      #0c1a45;
  --sb-border:   rgba(255,255,255,.07);
  --sb-text:     rgba(255,255,255,.6);
  --sb-text-h:   #fff;
  --sb-accent:   #fbbf24;
  --sb-active-bg:rgba(251,191,36,.12);
  --sb-radius:   10px;
  --sb-transition:.18s cubic-bezier(.4,0,.2,1);
}
 
/* ── BACKDROP ── */
.sb-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45);
  z-index: 900; cursor: pointer;
  animation: sbFadeIn .2s ease;
}
@keyframes sbFadeIn { from{opacity:0} to{opacity:1} }
 
/* ══ SIDEBAR ══ */
.sb-wrap {
  position: fixed; left: 0; top: 0; height: 100%;
  width: var(--sb-w);
  background: linear-gradient(170deg, var(--sb-bg) 0%, var(--sb-bg2) 100%);
  border-right: 1px solid var(--sb-border);
  display: flex; flex-direction: column;
  z-index: 1100;
  transition: transform var(--sb-transition);
  box-shadow: 4px 0 32px rgba(0,0,0,.25);
}
.sb-wrap.closed  { transform: translateX(-100%); }
.sb-wrap.opened  { transform: translateX(0); }
@media (min-width: 768px) { .sb-wrap { transform: translateX(0) !important; } }
 
/* ── BRAND ── */
.sb-brand {
  display: flex; align-items: center; gap: 11px;
  padding: 20px 18px;
  border-bottom: 1px solid var(--sb-border);
  cursor: pointer; text-decoration: none;
  transition: background var(--sb-transition);
}
.sb-brand:hover { background: rgba(255,255,255,.04); }
.sb-logo {
  width: 38px; height: 38px; border-radius: 10px;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,.2);
  flex-shrink: 0;
}
.sb-brand-name {
  font-family: 'Playfair Display', serif;
  font-size: .95rem; font-weight: 700; color: #fff; line-height: 1.2;
}
.sb-brand-name span { color: var(--sb-accent); }
.sb-brand-sub { font-size: .68rem; color: var(--sb-text); margin-top: 1px; }
 
/* ── SECTION LABEL ── */
.sb-section-lbl {
  padding: 16px 18px 6px;
  font-size: .6rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .1em; color: rgba(255,255,255,.25);
}
 
/* ── NAV ── */
.sb-nav {
  flex: 1; overflow-y: auto; padding: 6px 10px 12px;
  scrollbar-width: none;
}
.sb-nav::-webkit-scrollbar { display: none; }
 
/* ── NAV ITEM ── */
.sb-item {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 9px 12px; margin-bottom: 2px;
  border-radius: var(--sb-radius); border: none;
  background: none; color: var(--sb-text);
  font-family: 'Inter', sans-serif; font-size: .84rem; font-weight: 500;
  cursor: pointer; text-align: left;
  transition: background var(--sb-transition), color var(--sb-transition);
  position: relative;
}
.sb-item:hover {
  background: rgba(255,255,255,.06);
  color: var(--sb-text-h);
}
.sb-item.active {
  background: var(--sb-active-bg);
  color: var(--sb-accent);
  font-weight: 600;
}
 
/* Indicateur gauche actif */
.sb-item.active::before {
  content: '';
  position: absolute; left: 0; top: 20%; bottom: 20%;
  width: 3px; border-radius: 0 3px 3px 0;
  background: var(--sb-accent);
}
 
/* ── ICÔNE ── */
.sb-item-icon {
  width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: .9rem; transition: transform var(--sb-transition);
  background: rgba(255,255,255,.06);
}
.sb-item:hover  .sb-item-icon { transform: scale(1.08); }
.sb-item.active .sb-item-icon {
  background: rgba(251,191,36,.18);
  box-shadow: 0 2px 8px rgba(251,191,36,.2);
}
 
/* ── BADGE ── */
.sb-badge {
  margin-left: auto; flex-shrink: 0;
  background: rgba(239,68,68,.2); color: #fca5a5;
  border: 1px solid rgba(239,68,68,.3);
  font-size: .62rem; font-weight: 700; padding: 1px 7px;
  border-radius: 20px;
}
 
/* ── FOOTER ── */
.sb-footer {
  border-top: 1px solid var(--sb-border);
  padding: 14px 18px;
}
.sb-footer-user {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 8px; border-radius: var(--sb-radius);
  cursor: pointer; transition: background var(--sb-transition);
}
.sb-footer-user:hover { background: rgba(255,255,255,.06); }
.sb-footer-av {
  width: 30px; height: 30px; border-radius: 50%;
  background: rgba(251,191,36,.2); border: 1px solid rgba(251,191,36,.35);
  display: flex; align-items: center; justify-content: center;
  font-size: .75rem; font-weight: 700; color: var(--sb-accent); flex-shrink: 0;
}
.sb-footer-name { font-size: .78rem; font-weight: 600; color: var(--sb-text-h); }
.sb-footer-role { font-size: .65rem; color: var(--sb-text); }
.sb-footer-version {
  text-align: center; margin-top: 8px;
  font-size: .62rem; color: rgba(255,255,255,.2);
}
 
/* ── HOVER TOOLTIP (nom de l'onglet) ── */
.sb-item-label { flex: 1; }
`;
 
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
 
/* ── Map icônes par id d'onglet ── */
const ICONS = {
  dashboard:     '📊',
  books:         '📚',
  periodicals:   '📰',
  readers:       '👥',
  loans:         '📖',
  consultations: '🔍',
  alerts:        '⚠️',
  settings:      '⚙️',
  users:         '👥',
  activities:    '📜',
  stats:         '📈',
};
 
/* ── Nom d'utilisateur depuis localStorage ── */
function currentUser() {
  try {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    return { name: u?.nom || u?.username || 'Utilisateur', role: u?.role || 'bibliothécaire' };
  } catch { return { name: 'Utilisateur', role: 'bibliothécaire' }; }
}
function initials(name) {
  return name.slice(0,2).toUpperCase();
}
 
/* ═══════════════════════════════════════════
   COMPOSANT — props 100 % identiques à l'original
═══════════════════════════════════════════ */
export default function Sidebar({
  active  = 'dashboard',
  onChange= () => {},
  tabs    = [],
  open    = false,
  setOpen = () => {},
}) {
  const { t }  = useTranslation();
  const user   = currentUser();
 
  injectCSS('sb-css', CSS);
 
  return (
    <>
      {/* Backdrop mobile */}
      {open && (
        <div className="sb-backdrop" onClick={() => setOpen(false)}/>
      )}
 
      <aside className={`sb-wrap ${open ? 'opened' : 'closed'}`}>
 
        {/* Brand */}
        <div className="sb-brand">
          <img src={logo} alt="Logo" className="sb-logo"/>
          <div>
            <div className="sb-brand-name">Biblio<span>UAC</span></div>
            <div className="sb-brand-sub">{t('Espace bibliothécaire')}</div>
          </div>
        </div>
 
        {/* Navigation */}
        <div className="sb-section-lbl">{t('Navigation')}</div>
        <nav className="sb-nav">
          {tabs.length > 0 ? tabs.map(tab => (
            <button
              key={tab.id}
              className={`sb-item${tab.id === active ? ' active' : ''}`}
              onClick={() => {
                onChange(tab.id);
                setOpen(false); // ferme le menu mobile
              }}
            >
              <span className="sb-item-icon">
                {tab.icon || ICONS[tab.id] || '●'}
              </span>
              <span className="sb-item-label">{tab.label}</span>
              {/* badge retards sur l'onglet alertes */}
              {tab.id === 'alerts' && tab.badge > 0 && (
                <span className="sb-badge">{tab.badge}</span>
              )}
            </button>
          )) : (
            <p style={{padding:'12px',color:'rgba(255,255,255,.3)',fontSize:'.8rem'}}>
              {t('Aucun onglet')}
            </p>
          )}
        </nav>
 
        {/* Footer utilisateur */}
        <div className="sb-footer">
          <div className="sb-footer-user">
            <div className="sb-footer-av">{initials(user.name)}</div>
            <div>
              <div className="sb-footer-name">{user.name}</div>
              <div className="sb-footer-role" style={{textTransform:'capitalize'}}>
                {user.role}
              </div>
            </div>
          </div>
          <div className="sb-footer-version">v1.0 — Bibliothèque UAC</div>
        </div>
 
      </aside>
    </>
  );
}