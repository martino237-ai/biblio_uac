import React from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../assets/images/logo.jpeg';
import '../styles/admin.css';
 
/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700&display=swap');
 
.sa-wrap {
  --sa-w:         248px;
  --sa-bg:        #07163C;
  --sa-bg2:       #0a1a48;
  --sa-border:    rgba(255,255,255,.07);
  --sa-text:      rgba(255,255,255,.55);
  --sa-text-h:    #ffffff;
  --sa-accent:    #fbbf24;
  --sa-active-bg: rgba(251,191,36,.13);
  --sa-radius:    10px;
  --sa-tr:        .18s cubic-bezier(.4,0,.2,1);
}
 
/* ── BACKDROP ── */
.sa-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.5); z-index: 900;
  cursor: pointer;
  animation: saFade .2s ease;
}
@keyframes saFade { from{opacity:0} to{opacity:1} }
 
/* ══ SIDEBAR ADMIN ══ */
.sa-wrap {
  position: fixed; left: 0; top: 0; height: 100%;
  width: var(--sa-w);
  background: linear-gradient(175deg, var(--sa-bg) 0%, var(--sa-bg2) 100%);
  border-right: 1px solid var(--sa-border);
  display: flex; flex-direction: column;
  z-index: 1100;
  transition: transform var(--sa-tr);
  box-shadow: 6px 0 40px rgba(0,0,0,.3);
}
.sa-wrap.closed { transform: translateX(-100%); }
.sa-wrap.opened { transform: translateX(0); }
@media (min-width: 768px) { .sa-wrap { transform: translateX(0) !important; } }
 
/* ── BRAND ── */
.sa-brand {
  display: flex; align-items: center; gap: 11px;
  padding: 20px 18px;
  border-bottom: 1px solid var(--sa-border);
}
.sa-logo {
  width: 40px; height: 40px; border-radius: 11px;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,.2); flex-shrink: 0;
}
.sa-brand-title {
  font-family: 'Playfair Display', serif;
  font-size: .95rem; font-weight: 700; color: #fff; line-height: 1.2;
}
.sa-brand-title span { color: var(--sa-accent); }
.sa-brand-sub {
  display: inline-flex; align-items: center; gap: 4px;
  margin-top: 3px; padding: 2px 8px; border-radius: 20px;
  background: rgba(251,191,36,.12); border: 1px solid rgba(251,191,36,.25);
  color: var(--sa-accent); font-size: .62rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: .07em;
}
 
/* ── SECTION LABEL ── */
.sa-section {
  padding: 16px 18px 6px;
  font-size: .6rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .1em; color: rgba(255,255,255,.22);
}
 
/* ── NAV ── */
.sa-nav {
  flex: 1; overflow-y: auto; padding: 6px 10px 12px;
  scrollbar-width: none;
}
.sa-nav::-webkit-scrollbar { display: none; }
 
/* ── ITEM ── */
.sa-item {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 9px 12px; margin-bottom: 2px;
  border-radius: var(--sa-radius); border: none; background: none;
  color: var(--sa-text); font-family: 'Inter', sans-serif;
  font-size: .84rem; font-weight: 500; cursor: pointer; text-align: left;
  transition: background var(--sa-tr), color var(--sa-tr);
  position: relative;
}
.sa-item:hover {
  background: rgba(255,255,255,.06); color: var(--sa-text-h);
}
.sa-item.active {
  background: var(--sa-active-bg);
  color: var(--sa-accent); font-weight: 600;
}
.sa-item.active::before {
  content: '';
  position: absolute; left: 0; top: 20%; bottom: 20%;
  width: 3px; border-radius: 0 3px 3px 0;
  background: var(--sa-accent);
}
 
/* ── ICÔNE ── */
.sa-icon {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: .9rem; flex-shrink: 0;
  background: rgba(255,255,255,.06);
  transition: transform var(--sa-tr), background var(--sa-tr);
}
.sa-item:hover  .sa-icon { transform: scale(1.08); }
.sa-item.active .sa-icon {
  background: rgba(251,191,36,.18);
  box-shadow: 0 2px 8px rgba(251,191,36,.2);
}
 
/* ── LABEL ── */
.sa-item-label { flex: 1; }
 
/* ── BADGE ── */
.sa-item-badge {
  margin-left: auto; flex-shrink: 0;
  background: rgba(239,68,68,.2); color: #fca5a5;
  border: 1px solid rgba(239,68,68,.3);
  font-size: .62rem; font-weight: 700; padding: 1px 7px;
  border-radius: 20px;
}
 
/* ── DIVIDER ── */
.sa-divider {
  height: 1px; margin: 8px 14px;
  background: var(--sa-border);
}
 
/* ── FOOTER ── */
.sa-footer {
  border-top: 1px solid var(--sa-border); padding: 14px 18px;
}
.sa-footer-user {
  display: flex; align-items: center; gap: 9px;
  padding: 8px; border-radius: var(--sa-radius);
  cursor: pointer; transition: background var(--sa-tr);
}
.sa-footer-user:hover { background: rgba(255,255,255,.06); }
.sa-footer-av {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, rgba(239,68,68,.3), rgba(220,38,38,.2));
  border: 1.5px solid rgba(239,68,68,.4);
  display: flex; align-items: center; justify-content: center;
  font-size: .75rem; font-weight: 700; color: #fca5a5;
}
.sa-footer-name { font-size: .8rem; font-weight: 600; color: var(--sa-text-h); }
.sa-footer-role {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: .65rem; color: #fca5a5;
}
.sa-footer-role::before {
  content: ''; width: 5px; height: 5px; border-radius: 50%;
  background: #ef4444; display: inline-block;
}
.sa-footer-version {
  text-align: center; margin-top: 8px;
  font-size: .62rem; color: rgba(255,255,255,.18);
}
`;
 
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
 
function currentAdmin() {
  try {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    return { name: u?.nom || u?.username || 'Administrateur', role: u?.role || 'admin' };
  } catch { return { name: 'Administrateur', role: 'admin' }; }
}
function initials(name) { return name.slice(0,2).toUpperCase(); }
 
/* ═══════════════════════════════════════════
   COMPOSANT — props 100 % identiques à l'original
═══════════════════════════════════════════ */
export default function SidebarAdmin({
  active   = 'dashboard',
  onChange = () => {},
  tabs     = [],
  open     = false,
  setOpen  = () => {},
}) {
  const { t }  = useTranslation();
  const admin  = currentAdmin();
 
  injectCSS('sa-css', CSS);
 
  return (
    <>
      {open && (
        <div className="sa-backdrop" onClick={() => setOpen(false)}/>
      )}
 
      <div className={`sa-wrap ${open ? 'opened' : 'closed'}`}>
 
        {/* Brand */}
        <div className="sa-brand">
          <img src={logo} alt="Logo" className="sa-logo"/>
          <div>
            <div className="sa-brand-title">Biblio<span>UAC</span></div>
            <div className="sa-brand-sub">🔐 {t('Admin')}</div>
          </div>
        </div>
 
        {/* Section label */}
        <div className="sa-section">{t('Menu principal')}</div>
 
        {/* Nav */}
        <nav className="sa-nav">
          {tabs.map((tab, i) => {
            const isDivider = tab.id === 'settings' && i > 0;
            return (
              <React.Fragment key={tab.id}>
                {isDivider && <div className="sa-divider"/>}
                <button
                  className={`sa-item${active === tab.id ? ' active' : ''}`}
                  onClick={() => {
                    onChange(tab.id);
                    setOpen(false);
                  }}
                >
                  <span className="sa-icon">{tab.icon || '●'}</span>
                  <span className="sa-item-label">{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className="sa-item-badge">{tab.badge}</span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </nav>
 
        {/* Footer admin */}
        <div className="sa-footer">
          <div className="sa-footer-user">
            <div className="sa-footer-av">{initials(admin.name)}</div>
            <div>
              <div className="sa-footer-name">{admin.name}</div>
              <div className="sa-footer-role">{t('Administrateur')}</div>
            </div>
          </div>
          <div className="sa-footer-version">v1.0 — Bibliothèque UAC</div>
        </div>
 
      </div>
    </>
  );
}