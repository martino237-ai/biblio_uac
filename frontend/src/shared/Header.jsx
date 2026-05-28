import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
 
/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700&display=swap');
 
/* ── HEADER WRAPPER ── */
.hdr-root {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  height: 62px;
  background: linear-gradient(
    90deg,
    #07163C 0%,
    #0f2060 40%,
    #1a1060 70%,
    #07163C 100%
  );
  border-bottom: 1px solid rgba(255,255,255,.08);
  box-shadow: 0 4px 24px rgba(0,0,0,.25), 0 1px 0 rgba(255,255,255,.05) inset;
  display: flex; align-items: center;
  padding: 0 20px;
  gap: 12px;
  font-family: 'Inter', sans-serif;
}
 
/* Reflet subtil en haut */
.hdr-root::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
}
 
/* ── BURGER ── */
.hdr-burger {
  display: none;
  align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 9px;
  background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
  color: rgba(255,255,255,.85); cursor: pointer;
  transition: background .15s, transform .15s; flex-shrink: 0;
}
.hdr-burger:hover { background: rgba(255,255,255,.15); transform: scale(1.05); }
.hdr-burger svg { width: 18px; height: 18px; }
@media (max-width: 768px) { .hdr-burger { display: flex; } }
 
/* ── BRAND ── */
.hdr-brand {
  display: flex; align-items: center; gap: 10px; flex: 1;
  /* offset pour laisser place à la sidebar sur desktop */
  padding-left: 4px;
}
.hdr-brand-icon {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.2);
}
.hdr-brand-icon svg { width: 18px; height: 18px; color: #fff; }
.hdr-brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.05rem; font-weight: 700; color: #fff; letter-spacing: -.2px;
}
.hdr-brand-name span { color: #fbbf24; }
 
/* ── DIVIDER ── */
.hdr-sep {
  width: 1px; height: 28px; background: rgba(255,255,255,.1); margin: 0 4px;
}
 
/* ── BREADCRUMB / PAGE INFO ── */
.hdr-page {
  font-size: .75rem; color: rgba(255,255,255,.45); font-weight: 400;
  white-space: nowrap;
}
@media (max-width: 600px) { .hdr-page { display: none; } }
 
/* ── SPACER ── */
.hdr-spacer { flex: 1; }
 
/* ── RIGHT SECTION ── */
.hdr-right {
  display: flex; align-items: center; gap: 10px;
}
 
/* ── ROLE BADGE ── */
.hdr-role {
  display: flex; align-items: center; gap: 7px;
  padding: 6px 13px; border-radius: 20px;
  background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
  color: rgba(255,255,255,.85);
  font-size: .78rem; font-weight: 500;
  white-space: nowrap;
  transition: background .15s;
}
.hdr-role:hover { background: rgba(255,255,255,.13); }
.hdr-role-dot {
  width: 7px; height: 7px; border-radius: 50%;
  flex-shrink: 0;
}
.hdr-role-dot.admin { background: #f87171; box-shadow: 0 0 0 2px rgba(248,113,113,.25); }
.hdr-role-dot.biblio{ background: #4ade80; box-shadow: 0 0 0 2px rgba(74,222,128,.25); }
@media (max-width: 480px) { .hdr-role { display: none; } }
 
/* ── USER PILL ── */
.hdr-user {
  display: flex; align-items: center; gap: 8px;
  padding: 5px 12px 5px 5px;
  background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1);
  border-radius: 40px; cursor: default;
  transition: background .15s;
}
.hdr-user:hover { background: rgba(255,255,255,.12); }
.hdr-avatar {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  display: flex; align-items: center; justify-content: center;
  font-size: .7rem; font-weight: 800; color: #1e3a8a;
  border: 1.5px solid rgba(255,255,255,.25);
}
.hdr-username {
  font-size: .78rem; font-weight: 600; color: rgba(255,255,255,.88);
  white-space: nowrap; max-width: 100px;
  overflow: hidden; text-overflow: ellipsis;
}
@media (max-width: 560px) { .hdr-username { display: none; } }
 
/* ── LOGOUT BUTTON ── */
.hdr-logout {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 14px; border-radius: 9px; border: none;
  background: rgba(220,38,38,.2); border: 1px solid rgba(220,38,38,.35);
  color: #fca5a5;
  font-family: 'Inter', sans-serif; font-size: .78rem; font-weight: 600;
  cursor: pointer; white-space: nowrap;
  transition: background .15s, color .15s, transform .15s;
}
.hdr-logout:hover {
  background: rgba(220,38,38,.35); color: #fff;
  transform: translateY(-1px);
}
.hdr-logout:active { transform: none; }
.hdr-logout svg { width: 14px; height: 14px; flex-shrink: 0; }
.hdr-logout-label { }
@media (max-width: 420px) { .hdr-logout-label { display: none; } }
`;
 
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
 
/* ── Initiales depuis le nom ── */
function getInitials(user) {
  if (!user) return '?';
  const n = user.nom || user.username || '';
  return n.slice(0, 2).toUpperCase() || '?';
}
function getDisplayName(user) {
  if (!user) return '';
  return user.nom || user.username || '';
}
 
/* ═══════════════════════════════════════════
   COMPOSANT — logique 100 % identique à l'original
═══════════════════════════════════════════ */
export default function Header({ onToggleMenu }) {
  const { t } = useTranslation();
  const [role, setRole]   = useState('');
  const [user, setUser]   = useState(null);
 
  injectCSS('hdr-css', CSS);
 
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      setRole(u?.role || '');
      setUser(u);
    } catch (e) {
      setRole('');
    }
 
    // Listen for theme changes from settings — logique identique à l'original
    const handleThemeChange = (event) => {
      const nextTheme = event?.detail?.theme;
      if (nextTheme) applyTheme(nextTheme);
    };
 
    window.addEventListener('app-theme-change', handleThemeChange);
    return () => window.removeEventListener('app-theme-change', handleThemeChange);
    // eslint-disable-next-line
  }, []);
 
  function applyTheme(next) {
    const html = document.documentElement;
    if (next === 'dark') html.classList.add('dark');
    else html.classList.remove('dark');
  }
 
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location = '/login';
  }
 
  const roleLabel = role === 'directeur'
    ? t('Administrateur')
    : t('Bibliothécaire');
 
  const isAdmin = role === 'directeur';
 
  /* ════ RENDER ════ */
  return (
    <header className="hdr-root">
 
      {/* ── Burger mobile ── */}
      {onToggleMenu && (
        <button
          className="hdr-burger"
          onClick={onToggleMenu}
          aria-label="Toggle menu"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      )}
 
      {/* ── Brand ── */}
      <div className="hdr-brand">
        <div className="hdr-brand-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <span className="hdr-brand-name">
          Biblio<span>UAC</span>
        </span>
      </div>
 
      <div className="hdr-sep"/>
 
      <span className="hdr-page">
        {isAdmin ? '🔐 Espace administrateur' : '📚 Espace bibliothécaire'}
      </span>
 
      <div className="hdr-spacer"/>
 
      {/* ── Right section ── */}
      <div className="hdr-right">
 
        {/* Badge rôle */}
        <div className="hdr-role">
          <span className={`hdr-role-dot ${isAdmin ? 'admin' : 'biblio'}`}/>
          {roleLabel}
        </div>
 
        {/* Pill utilisateur */}
        {user && (
          <div className="hdr-user">
            <div className="hdr-avatar">{getInitials(user)}</div>
            <span className="hdr-username">{getDisplayName(user)}</span>
          </div>
        )}
 
        {/* Bouton déconnexion */}
        <button className="hdr-logout" onClick={logout} aria-label="Logout">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span className="hdr-logout-label">{t('Déconnexion')}</span>
        </button>
 
      </div>
    </header>
  );
}