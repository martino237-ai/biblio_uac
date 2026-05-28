import React, { useEffect, useRef } from 'react';
 
/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700&display=swap');
 
/* ── BACKDROP ── */
.mod-backdrop {
  position: fixed; inset: 0; z-index: 1200;
  background: rgba(7, 22, 60, 0.55);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
  animation: modBdIn .2s ease;
  overflow-y: auto;
}
@keyframes modBdIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
 
/* ── CARD ── */
.mod-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow:
    0 24px 80px rgba(7,22,60,.20),
    0 8px 24px rgba(7,22,60,.10),
    0 0 0 1px rgba(255,255,255,.9) inset;
  width: 100%;
  max-width: 680px;
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modCardIn .28s cubic-bezier(.34,1.26,.64,1);
  position: relative;
}
@keyframes modCardIn {
  from { opacity: 0; transform: scale(.94) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
 
/* bande colorée en haut */
.mod-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, #2563eb, #0ea5e9, #7c3aed);
  border-radius: 20px 20px 0 0;
}
 
/* ── HEADER ── */
.mod-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 26px 18px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}
.mod-title-wrap { display: flex; align-items: center; gap: 10px; }
.mod-title-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: #eff6ff; display: flex; align-items: center;
  justify-content: center; font-size: 1rem; flex-shrink: 0;
}
.mod-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 0;
  line-height: 1.2;
}
 
/* ── BOUTON FERMER ── */
.mod-close {
  width: 34px; height: 34px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  background: #f8fafc; border: 1px solid #e2e8f0;
  color: #94a3b8; font-size: .85rem; font-weight: 700;
  cursor: pointer; flex-shrink: 0;
  transition: background .15s, color .15s, border-color .15s, transform .15s;
  font-family: 'Inter', sans-serif;
  line-height: 1;
}
.mod-close:hover {
  background: #fef2f2; color: #dc2626;
  border-color: #fecaca; transform: rotate(90deg);
}
.mod-close:active { transform: rotate(90deg) scale(.9); }
 
/* ── BODY ── */
.mod-body {
  padding: 22px 26px 24px;
  overflow-y: auto;
  flex: 1;
  font-family: 'Inter', sans-serif;
  color: #0f172a;
  font-size: .875rem;
  line-height: 1.6;
 
  /* scrollbar fine */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.mod-body::-webkit-scrollbar { width: 5px; }
.mod-body::-webkit-scrollbar-track { background: transparent; }
.mod-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
.mod-body::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
 
/* ── RESPONSIVE ── */
@media (max-width: 600px) {
  .mod-backdrop { padding: 8px; align-items: flex-end; }
  .mod-card {
    border-radius: 18px 18px 0 0;
    max-height: 90vh;
    animation: modCardInMobile .28s cubic-bezier(.34,1.26,.64,1);
  }
  @keyframes modCardInMobile {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mod-header { padding: 18px 18px 14px; }
  .mod-body   { padding: 16px 18px 20px; }
  .mod-title  { font-size: 1rem; }
}
`;
 
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
 
/* ── Icône selon le titre ── */
function guessIcon(title = '') {
  const t = title.toLowerCase();
  if (t.includes('livre') || t.includes('ouvrage') || t.includes('book'))    return '📚';
  if (t.includes('lecteur') || t.includes('reader') || t.includes('profil')) return '👤';
  if (t.includes('emprunt') || t.includes('loan'))                           return '📖';
  if (t.includes('consul'))                                                   return '🔍';
  if (t.includes('modif') || t.includes('edit'))                             return '✏️';
  if (t.includes('ajout') || t.includes('nouveau') || t.includes('new'))     return '➕';
  if (t.includes('supprim') || t.includes('delet'))                          return '🗑';
  if (t.includes('param') || t.includes('setting'))                          return '⚙️';
  if (t.includes('alerte') || t.includes('alert'))                           return '⚠️';
  if (t.includes('périodique') || t.includes('journal'))                     return '📰';
  if (t.includes('détail') || t.includes('fiche'))                           return '📋';
  return '📄';
}
 
/* ═══════════════════════════════════════════
   COMPOSANT — props identiques à l'original
   { title, onClose, children }
═══════════════════════════════════════════ */
export default function Modal({ title, onClose, children }) {
  injectCSS('mod-css', CSS);
 
  const cardRef = useRef(null);
 
  /* Fermeture avec Escape */
  useEffect(() => {
    if (!onClose) return;
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
 
  /* Empêcher le scroll du body */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
 
  /* Clic sur le backdrop = fermer */
  function onBackdropClick(e) {
    if (onClose && cardRef.current && !cardRef.current.contains(e.target)) {
      onClose();
    }
  }
 
  return (
    <div className="mod-backdrop" onClick={onBackdropClick}>
      <div className="mod-card" ref={cardRef}>
 
        {/* ── HEADER ── */}
        <div className="mod-header">
          <div className="mod-title-wrap">
            <div className="mod-title-icon">{guessIcon(title)}</div>
            <h3 className="mod-title">{title}</h3>
          </div>
 
          {onClose && (
            <button
              className="mod-close"
              onClick={onClose}
              aria-label="Fermer"
              title="Fermer (Echap)"
            >
              ✕
            </button>
          )}
        </div>
 
        {/* ── BODY ── */}
        <div className="mod-body">
          {children}
        </div>
 
      </div>
    </div>
  );
}
 