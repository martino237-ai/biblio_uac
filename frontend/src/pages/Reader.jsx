import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import BookDetailsPanel from '../panels/BookDetailsPanel';
import BooksPanel from '../panels/BooksPanel';
import SettingsPanel from '../panels/SettingsPanel';
import { GenericBookCover, OnlineBookCover } from '../components/BookCover';
 
/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700&display=swap');
 
:root {
  --bk-primary:    #2563eb;
  --bk-primary-dk: #1d4ed8;
  --bk-primary-lt: #eff6ff;
  --bk-success:    #16a34a;
  --bk-success-lt: #f0fdf4;
  --bk-danger:     #dc2626;
  --bk-danger-lt:  #fef2f2;
  --bk-purple:     #7c3aed;
  --bk-purple-lt:  #ede9fe;
  --bk-text:       #0f172a;
  --bk-text-2:     #475569;
  --bk-text-3:     #94a3b8;
  --bk-border:     #e2e8f0;
  --bk-surface:    #ffffff;
  --bk-bg:         #f1f5f9;
  --bk-radius:     14px;
  --bk-radius-sm:  9px;
  --bk-transition: .2s cubic-bezier(.4,0,.2,1);
}

/* Mode sombre */
.dark {
  --bk-primary:    #3b82f6;
  --bk-primary-dk: #2563eb;
  --bk-primary-lt: #1e3a8a;
  --bk-success:    #10b981;
  --bk-success-lt: #064e3b;
  --bk-danger:     #ef4444;
  --bk-danger-lt:  #7f1d1d;
  --bk-purple:     #a78bfa;
  --bk-purple-lt:  #4c1d95;
  --bk-text:       #f1f5f9;
  --bk-text-2:     #cbd5e1;
  --bk-text-3:     #94a3b8;
  --bk-border:     #334155;
  --bk-surface:    #1e293b;
  --bk-bg:         #0f172a;
}
 
/* ── LAYOUT ── */
.bk-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bk-bg);
  font-family: 'Inter', sans-serif;
  color: var(--bk-text);
}
 
/* ══════════════════════════════
   SIDEBAR
══════════════════════════════ */
.bk-sidebar {
  width: 220px;
  min-height: 100vh;
  background: var(--bk-surface);
  border-right: 1px solid var(--bk-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
}
 
.bk-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 16px;
  border-bottom: 1px solid var(--bk-border);
}
.bk-brand-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: var(--bk-primary-lt);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; flex-shrink: 0;
}
.bk-brand-name {
  font-family: 'Playfair Display', serif;
  font-size: .95rem; font-weight: 600; color: var(--bk-text);
  line-height: 1.2;
}
.bk-brand-sub { font-size: .7rem; color: var(--bk-text-3); }
 
.bk-nav-section {
  padding: 16px 12px 6px;
  font-size: .65rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: .1em;
  color: var(--bk-text-3);
}
.bk-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px; margin: 1px 8px;
  border-radius: var(--bk-radius-sm);
  font-size: .83rem; font-weight: 500; color: var(--bk-text-2);
  cursor: pointer; background: none; border: none;
  width: calc(100% - 16px); text-align: left;
  font-family: 'Inter', sans-serif;
  transition: var(--bk-transition);
}
.bk-nav-item:hover { background: var(--bk-bg); color: var(--bk-text); }
.bk-nav-item.active {
  background: var(--bk-primary-lt); color: var(--bk-primary);
}
.bk-nav-icon { font-size: 1.05rem; flex-shrink: 0; }
.bk-nav-badge {
  margin-left: auto;
  background: var(--bk-primary-lt); color: var(--bk-primary);
  font-size: .65rem; font-weight: 700;
  padding: 1px 7px; border-radius: 20px;
}
.bk-nav-item.active .bk-nav-badge { background: #bfdbfe; }
 
.bk-sidebar-bottom {
  margin-top: auto;
  border-top: 1px solid var(--bk-border);
  padding: 12px;
}
.bk-user-row {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 6px; border-radius: var(--bk-radius-sm);
  cursor: pointer; transition: var(--bk-transition);
}
.bk-user-row:hover { background: var(--bk-bg); }
.bk-avatar-sm {
  width: 32px; height: 32px; border-radius: 50%;
  background: #dbeafe; display: flex; align-items: center;
  justify-content: center; font-size: .75rem; font-weight: 700;
  color: #1e40af; flex-shrink: 0;
}
.bk-user-name { font-size: .8rem; font-weight: 600; color: var(--bk-text); }
.bk-user-role { font-size: .7rem; color: var(--bk-text-3); }
.bk-logout-btn {
  display: flex; align-items: center; gap: 7px;
  width: 100%; padding: 7px 8px; margin-top: 4px;
  border-radius: var(--bk-radius-sm);
  border: 1px solid var(--bk-border);
  background: none; color: var(--bk-text-2);
  font-family: 'Inter', sans-serif; font-size: .8rem;
  cursor: pointer; transition: var(--bk-transition);
}
.bk-logout-btn:hover { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
 
/* ══════════════════════════════
   CONTENU PRINCIPAL
══════════════════════════════ */
.bk-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
 
.bk-topbar {
  background: var(--bk-surface);
  border-bottom: 1px solid var(--bk-border);
  padding: 12px 20px;
  display: flex; align-items: center; gap: 12px;
  position: sticky; top: 0; z-index: 10;
}
.bk-topbar h1 {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem; font-weight: 600; color: var(--bk-text);
  margin: 0; margin-right: auto;
}
.bk-search-box {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 12px; border: 1.5px solid var(--bk-border);
  border-radius: 40px; background: var(--bk-bg);
  transition: var(--bk-transition);
}
.bk-search-box:focus-within { border-color: var(--bk-primary); background: var(--bk-surface); }
.bk-search-box input {
  border: none; background: none; font-size: .83rem;
  color: var(--bk-text); outline: none; width: 200px;
  font-family: 'Inter', sans-serif;
}
.bk-search-box input::placeholder { color: var(--bk-text-3); }
.bk-search-icon { color: var(--bk-text-3); font-size: .9rem; }
 
.bk-content { padding: 20px; flex: 1; }
 
/* ══════════════════════════════
   STATS
══════════════════════════════ */
.bk-stats {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 12px; margin-bottom: 20px;
}
.bk-stat {
  background: var(--bk-surface); border: 1px solid var(--bk-border);
  border-radius: var(--bk-radius-sm); padding: 12px 16px;
}
.bk-stat-n { font-size: 1.6rem; font-weight: 800; color: var(--bk-text); line-height: 1; }
.bk-stat-l { font-size: .72rem; color: var(--bk-text-3); font-weight: 500; margin-top: 3px; }
.bk-stat.ok   .bk-stat-n { color: var(--bk-success); }
.bk-stat.bad  .bk-stat-n { color: var(--bk-danger); }

.bk-history-card {
  background: var(--bk-surface);
  border: 1px solid var(--bk-border);
  border-radius: var(--bk-radius-sm);
  overflow-x: auto;
  margin-bottom: 24px;
}
.bk-history-table {
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
}
.bk-history-table th,
.bk-history-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--bk-border);
  text-align: left;
  vertical-align: middle;
  font-size: .85rem;
}
.bk-history-table th {
  color: var(--bk-text-3);
  font-weight: 700;
}
.bk-history-table tbody tr:hover {
  background: #f8fafc;
}
.dark .bk-history-table tbody tr:hover {
  background: #334155;
}
.bk-history-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: .75rem;
  font-weight: 700;
}
.bk-history-badge.ok { background: #ecfdf5; color: #166534; }
.bk-history-badge.warn { background: #fef3c7; color: #986b0d; }
.bk-history-badge.danger { background: #fee2e2; color: #b91c1c; }
.dark .bk-history-badge.ok { background: #064e3b; color: #86efac; }
.dark .bk-history-badge.warn { background: #713f12; color: #fbbf24; }
.dark .bk-history-badge.danger { background: #7f1d1d; color: #fca5a5; }
.bk-history-card-title {
  font-size: .95rem;
  font-weight: 700;
  margin-bottom: 12px;
}
.bk-history-empty {
  padding: 28px 20px;
  background: var(--bk-surface);
  border: 1px solid var(--bk-border);
  border-radius: var(--bk-radius-sm);
  text-align: center;
  color: var(--bk-text-3);
}

/* ══════════════════════════════
   FILTRES CATÉGORIES
══════════════════════════════ */
.bk-cats {
  display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 18px;
}
.bk-cat {
  padding: 6px 14px; border-radius: 20px;
  border: 1.5px solid var(--bk-border);
  background: var(--bk-surface); color: var(--bk-text-2);
  font-family: 'Inter', sans-serif; font-size: .78rem; font-weight: 500;
  cursor: pointer; transition: var(--bk-transition);
}
.bk-cat:hover { border-color: #93c5fd; background: var(--bk-primary-lt); }
.bk-cat.active {
  background: var(--bk-primary-lt); color: var(--bk-primary);
  border-color: #93c5fd; font-weight: 600;
}
.dark .bk-cat:hover { border-color: #3b82f6; }
.dark .bk-cat.active { border-color: #3b82f6; }
 
/* ══════════════════════════════
   GRILLE LIVRES
══════════════════════════════ */
.bk-section-label {
  font-size: .78rem; font-weight: 600; color: var(--bk-text-2);
  margin-bottom: 12px; display: flex; align-items: center; gap: 6px;
}
.bk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
 
/* ── CARTE LIVRE ── */
.bk-card {
  background: var(--bk-surface); border: 1px solid var(--bk-border);
  border-radius: var(--bk-radius); overflow: hidden; cursor: pointer;
  display: flex; flex-direction: column;
  transition: transform var(--bk-transition), box-shadow var(--bk-transition), border-color var(--bk-transition);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.bk-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(15,23,42,.15);
  border-color: #60a5fa;
}
 
/* ── couverture locale (placeholder coloré) ── */
.bk-cover-local {
  height: 170px; position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.bk-cover-local.c1 { background: linear-gradient(135deg, #0f4c75 0%, #3282b8 50%, #0f4c75 100%); }
.bk-cover-local.c2 { background: linear-gradient(135deg, #0d5c3f 0%, #16a34a 50%, #0d5c3f 100%); }
.bk-cover-local.c3 { background: linear-gradient(135deg, #8b4513 0%, #d97706 50%, #8b4513 100%); }
.bk-cover-local.c4 { background: linear-gradient(135deg, #7d0d57 0%, #db2777 50%, #7d0d57 100%); }
.bk-cover-local.c5 { background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #4c1d95 100%); }
.bk-cover-local.c6 { background: linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #7c2d12 100%); }

.bk-spine {
  position: absolute; left: 0; top: 0; bottom: 0; width: 8px;
}
.bk-cover-local.c1 .bk-spine { background: linear-gradient(180deg,#1e40af,#0c3c7a); box-shadow: 2px 0 8px rgba(0,0,0,0.3); }
.bk-cover-local.c2 .bk-spine { background: linear-gradient(180deg,#15803d,#0a3e2a); box-shadow: 2px 0 8px rgba(0,0,0,0.3); }
.bk-cover-local.c3 .bk-spine { background: linear-gradient(180deg,#c84400,#6b3410); box-shadow: 2px 0 8px rgba(0,0,0,0.3); }
.bk-cover-local.c4 .bk-spine { background: linear-gradient(180deg,#be185d,#6b0f47); box-shadow: 2px 0 8px rgba(0,0,0,0.3); }
.bk-cover-local.c5 .bk-spine { background: linear-gradient(180deg,#6d28d9,#371d5e); box-shadow: 2px 0 8px rgba(0,0,0,0.3); }
.bk-cover-local.c6 .bk-spine { background: linear-gradient(180deg,#d97706,#8b2b0d); box-shadow: 2px 0 8px rgba(0,0,0,0.3); }

.bk-cover-ph {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 12px; padding: 0 16px; z-index: 1;
}
.bk-cover-ph-icon { font-size: 3.5rem; opacity: .7; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); }
.bk-cover-ph-title {
  font-size: .82rem; font-weight: 800; color: #ffffff;
  text-align: center; text-transform: uppercase; letter-spacing: .08em;
  line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 3;
  -webkit-box-orient: vertical; overflow: hidden;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  background: #ede9fe;
}
.bk-cover-online img,
.bk-cover-local-img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform .4s ease;
}
.bk-card:hover .bk-cover-online img,
.bk-card:hover .bk-cover-local-img { transform: scale(1.06); }
.bk-cover-online .bk-cover-ph {
  position: absolute; inset: 0; width: 100%; height: 100%;
}
 
/* badges sur couverture */
.bk-badge-dispo {
  position: absolute; top: 8px; right: 8px; z-index: 2;
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 10px; border-radius: 20px; font-size: .7rem; font-weight: 700;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.bk-badge-dispo.ok   { background: rgba(34, 197, 94, 0.95); color: #fff; border: 1px solid rgba(255,255,255,0.3); }
.bk-badge-dispo.no   { background: rgba(239, 68, 68, 0.95); color: #fff; border: 1px solid rgba(255,255,255,0.3); }
.bk-badge-free {
  position: absolute; top: 8px; left: 8px; z-index: 2;
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 10px; border-radius: 20px; font-size: .7rem; font-weight: 700;
  background: rgba(99, 102, 241, 0.95); color: #fff; border: 1px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.bk-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
 
.bk-code-tag {
  position: absolute; bottom: 8px; left: 8px; z-index: 2;
  background: rgba(15,23,42,.85); color: #fff;
  font-size: .65rem; font-weight: 700; font-family: 'Courier New', monospace;
  padding: 3px 8px; border-radius: 5px; backdrop-filter: blur(4px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.dark .bk-code-tag {
  background: rgba(241,245,249,.85); color: #0f172a;
}
 
/* ── corps carte ── */
.bk-body { padding: 11px 13px 10px; flex: 1; display: flex; flex-direction: column; gap: 5px; }
.bk-card-genre {
  display: inline-flex; align-items: center; gap: 4px;
  background: var(--bk-primary-lt); color: var(--bk-primary);
  border: 1px solid #bfdbfe; border-radius: 20px;
  font-size: .65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .05em; padding: 2px 8px; align-self: flex-start;
}
.bk-card-title {
  font-family: 'Playfair Display', serif;
  font-size: .88rem; font-weight: 600; color: var(--bk-text);
  line-height: 1.3; margin: 0;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
.bk-card-author {
  font-size: .75rem; color: var(--bk-text-2); margin: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.bk-card-meta {
  display: flex; align-items: center; gap: 8px;
  font-size: .7rem; color: var(--bk-text-3);
  flex-wrap: wrap;
}
.bk-card-exemplaires {
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 8px; border-radius: 7px; background: #f8fafc;
  border: 1px solid var(--bk-border); margin-top: 2px;
}
.bk-card-ex-label { font-size: .68rem; color: var(--bk-text-2); font-weight: 500; }
.bk-card-ex-val   { font-size: .75rem; font-weight: 700; color: var(--bk-text); }
.bk-card-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  margin-top: 2px;
}
.bk-card-info {
  min-width: 0;
  padding: 6px 8px;
  border: 1px solid var(--bk-border);
  border-radius: 8px;
  background: #f8fafc;
}
.bk-card-info-label {
  display: block;
  color: var(--bk-text-3);
  font-size: .6rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 2px;
}
.bk-card-info-value {
  display: block;
  color: var(--bk-text-2);
  font-size: .7rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bk-card-summary {
  color: var(--bk-text-2);
  font-size: .7rem;
  line-height: 1.45;
  margin: 2px 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.bk-card-status {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 2px;
}
.bk-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: .66rem;
  font-weight: 700;
  border: 1px solid var(--bk-border);
}
.bk-status-pill.ok {
  background: #ecfdf5;
  color: #166534;
  border-color: #bbf7d0;
}
.bk-status-pill.warn {
  background: #fef3c7;
  color: #92400e;
  border-color: #fde68a;
}
.bk-status-pill.bad {
  background: #fee2e2;
  color: #991b1b;
  border-color: #fecaca;
}
 
/* ── action ── */
.bk-card-footer {
  border-top: 1px solid var(--bk-border); background: #fafbfc;
  padding: 8px 12px;
}
.bk-btn-details {
  display: block; width: 100%; padding: 7px;
  border-radius: 8px; border: none;
  background: var(--bk-primary); color: #fff;
  font-family: 'Inter', sans-serif; font-size: .75rem; font-weight: 600;
  cursor: pointer; text-align: center; text-decoration: none;
  transition: var(--bk-transition);
}
.bk-btn-details:hover { background: var(--bk-primary-dk); }
.bk-btn-online {
  display: block; width: 100%; padding: 7px;
  border-radius: 8px; border: none;
  background: var(--bk-purple-lt); color: var(--bk-purple);
  font-family: 'Inter', sans-serif; font-size: .75rem; font-weight: 600;
  cursor: pointer; text-align: center; text-decoration: none;
  transition: var(--bk-transition);
}
.bk-btn-online:hover { background: #ddd6fe; }
 
/* ── EMPTY / LOADING ── */
.bk-loading, .bk-empty {
  text-align: center; padding: 60px 20px; color: var(--bk-text-2);
}
.bk-spinner {
  width: 40px; height: 40px; margin: 0 auto 14px;
  border: 3px solid var(--bk-border); border-top-color: var(--bk-primary);
  border-radius: 50%; animation: bk-spin .7s linear infinite;
}
@keyframes bk-spin { to { transform: rotate(360deg); } }
.bk-empty-icon { font-size: 3.5rem; opacity: .35; margin-bottom: 12px; }
.bk-empty h3 { font-family: 'Playfair Display', serif; font-size: 1.1rem; margin: 0 0 6px; }
.bk-empty p  { font-size: .83rem; color: var(--bk-text-3); margin: 0; }
 
/* ── RESPONSIVE ── */

/* Tablettes et petits écrans (1024px) */
@media (max-width: 1024px) {
  .bk-sidebar { width: 180px; }
  .bk-brand-name { font-size: .85rem; }
  .bk-nav-section { font-size: .6rem; }
  .bk-nav-item { font-size: .75rem; padding: 8px 10px; }
  .bk-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; }
  .bk-topbar h1 { font-size: 1.1rem; }
  .bk-search-box input { width: 150px; }
  .bk-content { padding: 16px; }
}

/* Tablettes en mode portrait (768px) */
@media (max-width: 768px) {
  .bk-layout { flex-direction: column; }
  
  .bk-sidebar {
    width: 100%;
    min-height: auto;
    height: auto;
    flex-direction: row;
    border-right: none;
    border-bottom: 1px solid var(--bk-border);
    padding: 0;
    position: static;
    overflow-x: auto;
    flex-wrap: wrap;
  }
  
  .bk-brand {
    padding: 12px 16px;
    border-bottom: none;
    border-right: 1px solid var(--bk-border);
    gap: 8px;
    flex-shrink: 0;
  }
  
  .bk-brand-icon { width: 30px; height: 30px; font-size: 0.9rem; }
  .bk-brand-name { font-size: .8rem; }
  .bk-brand-sub { font-size: .6rem; }
  
  .bk-nav-section {
    display: none;
  }
  
  .bk-nav-item {
    padding: 6px 12px;
    font-size: .7rem;
    margin: 0;
  }
  
  .bk-sidebar-bottom {
    display: none;
  }
  
  .bk-main { flex: 1; }
  
  .bk-topbar {
    flex-direction: column;
    gap: 10px;
    padding: 12px 16px;
  }
  
  .bk-topbar h1 {
    font-size: 1rem;
    margin-right: 0;
  }
  
  .bk-search-box {
    width: 100%;
    order: 2;
  }
  
  .bk-search-box input {
    width: 100%;
    font-size: .75rem;
  }
  
  .bk-content {
    padding: 12px;
  }
  
  .bk-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
  }
  
  .bk-stats {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 16px;
  }
  
  .bk-stat {
    padding: 10px 12px;
    font-size: .85rem;
  }
  
  .bk-stat-n { font-size: 1.3rem; }
  .bk-stat-l { font-size: .65rem; }
  
  .bk-cats {
    gap: 6px;
    margin-bottom: 14px;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 8px;
  }
  
  .bk-cat {
    padding: 5px 12px;
    font-size: .7rem;
    flex-shrink: 0;
  }
  
  .bk-cover-local {
    height: 140px;
  }
  
  .bk-cover-online {
    height: 140px;
  }
  
  .bk-card-title {
    font-size: .75rem;
  }
  
  .bk-card-author {
    font-size: .65rem;
  }
  
  .bk-card-meta {
    font-size: .6rem;
  }
  
  .bk-card-ex-label {
    font-size: .6rem;
  }
  
  .bk-card-ex-val {
    font-size: .65rem;
  }
  
  .bk-btn-details, .bk-btn-online {
    font-size: .7rem;
    padding: 6px;
  }
  
  .bk-cover-ph-title {
    font-size: .6rem;
  }
  
  .bk-section-label {
    font-size: .7rem;
    margin-bottom: 10px;
  }
  
  .bk-loading, .bk-empty {
    padding: 40px 16px;
  }
  
  .bk-empty-icon {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }
  
  .bk-empty h3 {
    font-size: 0.95rem;
    margin: 0 0 4px;
  }
  
  .bk-empty p {
    font-size: .75rem;
  }
}

/* Téléphones (600px) */
@media (max-width: 600px) {
  .bk-topbar {
    padding: 10px 12px;
  }
  
  .bk-topbar h1 {
    font-size: 0.9rem;
  }
  
  .bk-search-box {
    padding: 6px 10px;
  }
  
  .bk-search-box input {
    font-size: .7rem;
    width: 100%;
  }
  
  .bk-search-icon {
    font-size: 0.8rem;
  }
  
  .bk-content {
    padding: 10px;
  }
  
  .bk-grid {
    grid-template-columns: repeat(auto-fill, minmax(115px, 1fr));
    gap: 8px;
  }
  
  .bk-stats {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .bk-stat {
    padding: 8px 10px;
  }
  
  .bk-stat-n {
    font-size: 1.2rem;
  }
  
  .bk-stat-l {
    font-size: .6rem;
  }
  
  .bk-cats {
    gap: 5px;
    margin-bottom: 12px;
  }
  
  .bk-cat {
    padding: 4px 10px;
    font-size: .65rem;
  }
  
  .bk-cover-local {
    height: 130px;
  }
  
  .bk-cover-online {
    height: 130px;
  }
  
  .bk-cover-ph-icon {
    font-size: 2rem;
  }
  
  .bk-cover-ph-title {
    font-size: .55rem;
  }
  
  .bk-body {
    padding: 8px 10px;
    gap: 3px;
  }
  
  .bk-card-genre {
    font-size: .6rem;
    padding: 1px 6px;
  }
  
  .bk-card-title {
    font-size: .7rem;
  }
  
  .bk-card-author {
    font-size: .6rem;
  }
  
  .bk-card-meta {
    font-size: .55rem;
    gap: 5px;
  }
  
  .bk-card-exemplaires {
    padding: 4px 6px;
    gap: 4px;
    font-size: .65rem;
  }
  
  .bk-card-ex-label {
    font-size: .55rem;
  }
  
  .bk-card-ex-val {
    font-size: .6rem;
  }
  
  .bk-btn-details, .bk-btn-online {
    font-size: .65rem;
    padding: 5px;
  }
  
  .bk-badge-dispo {
    top: 4px;
    right: 4px;
    padding: 2px 6px;
    font-size: .6rem;
  }
  
  .bk-badge-free {
    top: 4px;
    left: 4px;
    padding: 2px 6px;
    font-size: .6rem;
  }
  
  .bk-code-tag {
    bottom: 4px;
    left: 4px;
    padding: 1px 5px;
    font-size: .55rem;
  }
  
  .bk-section-label {
    font-size: .65rem;
    margin-bottom: 8px;
  }
  
  .bk-card-footer {
    padding: 6px 8px;
  }
  
  .bk-loading, .bk-empty {
    padding: 30px 12px;
  }
  
  .bk-spinner {
    width: 30px;
    height: 30px;
    margin: 0 auto 10px;
  }
  
  .bk-empty-icon {
    font-size: 2rem;
    margin-bottom: 8px;
  }
  
  .bk-empty h3 {
    font-size: 0.85rem;
  }
  
  .bk-empty p {
    font-size: .7rem;
  }
}

/* Ultra-petits écrans (420px) */
@media (max-width: 420px) {
  .bk-brand {
    padding: 10px 12px;
  }
  
  .bk-brand-icon { width: 26px; height: 26px; font-size: 0.75rem; }
  .bk-brand-name { font-size: .7rem; }
  .bk-brand-sub { font-size: .55rem; }
  
  .bk-nav-item {
    padding: 5px 8px;
    font-size: .65rem;
  }
  
  .bk-topbar {
    padding: 8px 10px;
    gap: 8px;
  }
  
  .bk-topbar h1 {
    font-size: 0.8rem;
  }
  
  .bk-search-box {
    padding: 5px 8px;
  }
  
  .bk-search-box input {
    font-size: .65rem;
  }
  
  .bk-content {
    padding: 8px;
  }
  
  .bk-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 6px;
  }
  
  .bk-stats {
    grid-template-columns: 1fr;
    gap: 6px;
    margin-bottom: 10px;
  }
  
  .bk-stat {
    padding: 6px 8px;
  }
  
  .bk-stat-n {
    font-size: 1rem;
  }
  
  .bk-stat-l {
    font-size: .55rem;
  }
  
  .bk-cover-local {
    height: 110px;
  }
  
  .bk-cover-online {
    height: 110px;
  }
  
  .bk-cover-ph-icon {
    font-size: 1.5rem;
  }
  
  .bk-body {
    padding: 6px 8px;
  }
  
  .bk-card-title {
    font-size: .65rem;
  }
  
  .bk-card-author {
    font-size: .55rem;
  }
  
  .bk-btn-details, .bk-btn-online {
    font-size: .6rem;
    padding: 4px;
  }
}

/* Design refresh lecteur */
html.dark .bk-layout,
.bk-layout.dark {
  --bk-primary: #60a5fa;
  --bk-primary-dk: #3b82f6;
  --bk-primary-lt: rgba(96,165,250,.16);
  --bk-success: #34d399;
  --bk-success-lt: rgba(52,211,153,.14);
  --bk-danger: #fb7185;
  --bk-danger-lt: rgba(251,113,133,.14);
  --bk-purple: #c084fc;
  --bk-purple-lt: rgba(192,132,252,.16);
  --bk-text: #f8fafc;
  --bk-text-2: #cbd5e1;
  --bk-text-3: #94a3b8;
  --bk-border: rgba(148,163,184,.24);
  --bk-surface: #111827;
  --bk-bg: #020617;
}

.bk-layout {
  background:
    radial-gradient(circle at top left, rgba(37,99,235,.08), transparent 30%),
    linear-gradient(135deg, #eef4ff 0%, #f8fafc 46%, #f6f2ff 100%);
}
html.dark .bk-layout,
.bk-layout.dark {
  background:
    radial-gradient(circle at top left, rgba(96,165,250,.16), transparent 32%),
    linear-gradient(135deg, #020617 0%, #0f172a 52%, #111827 100%);
}

.bk-sidebar {
  width: 248px;
  background: linear-gradient(180deg, #07163c 0%, #0f2060 54%, #101827 100%);
  border-right: 1px solid rgba(255,255,255,.08);
  box-shadow: 8px 0 28px rgba(15,23,42,.18);
  color: rgba(255,255,255,.72);
}
.bk-brand {
  padding: 20px 18px;
  border-bottom-color: rgba(255,255,255,.08);
}
.bk-brand-icon {
  background: rgba(251,191,36,.16);
  border: 1px solid rgba(251,191,36,.28);
  color: #fbbf24;
}
.bk-brand-name { color: #fff; }
.bk-brand-sub { color: rgba(255,255,255,.55); }
.bk-nav-section {
  color: rgba(255,255,255,.34);
  letter-spacing: .08em;
  padding-top: 18px;
}
.bk-nav-item {
  color: rgba(255,255,255,.68);
  border-radius: 10px;
  padding: 10px 12px;
  margin: 3px 10px;
  width: calc(100% - 20px);
  gap: 11px;
}
.bk-nav-item:hover {
  background: rgba(255,255,255,.07);
  color: #fff;
}
.bk-nav-item.active {
  background: rgba(251,191,36,.14);
  color: #fbbf24;
  box-shadow: inset 3px 0 0 #fbbf24;
}
.bk-nav-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,.07);
}
.bk-nav-item.active .bk-nav-icon { background: rgba(251,191,36,.18); }
.bk-nav-badge {
  background: rgba(96,165,250,.18);
  border: 1px solid rgba(96,165,250,.24);
  color: #bfdbfe;
}
.bk-nav-danger:hover {
  background: rgba(239,68,68,.14);
  color: #fecaca;
}
.bk-sidebar-bottom {
  border-top-color: rgba(255,255,255,.08);
  padding: 14px;
}
.bk-user-row {
  background: rgba(255,255,255,.06);
  cursor: default;
}
.bk-user-row:hover { background: rgba(255,255,255,.09); }
.bk-avatar-sm {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #172554;
}
.bk-user-name { color: #fff; }
.bk-user-role { color: rgba(255,255,255,.5); }

.bk-main { min-height: 100vh; }
.bk-topbar {
  background: rgba(255,255,255,.84);
  backdrop-filter: blur(14px);
  border-bottom-color: rgba(148,163,184,.28);
  padding: 16px 24px;
  box-shadow: 0 8px 24px rgba(15,23,42,.05);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
    flex-wrap: wrap;
  }
html.dark .bk-topbar,
.dark .bk-topbar {
  background: rgba(15,23,42,.82);
  box-shadow: 0 8px 24px rgba(0,0,0,.28);
}
.bk-topbar h1 {
  font-family: 'Inter', sans-serif;
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0;
  order: 2;
  flex: 1 1 auto;
  min-width: 0;
}
.bk-search-box {
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(15,23,42,.04);
  order: 3;
  flex: 1 1 100%;
}
html.dark .bk-search-box,
.dark .bk-search-box {
  background: rgba(15,23,42,.78);
}
.bk-search-box input { min-height: 24px; }

.bk-hamburger {
  display: none;
  background: none;
  border: none;
  font-size: 1.35rem;
  color: var(--bk-text);
  cursor: pointer;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  transition: background .2s ease;
  order: 1;
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  padding: 26px;
}

.bk-stats {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
}
.bk-stat {
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 8px 24px rgba(15,23,42,.07);
}
html.dark .bk-stat,
.dark .bk-stat {
  box-shadow: 0 10px 28px rgba(0,0,0,.24);
}
.bk-stat-n { font-size: 1.9rem; }

.bk-card,
.bk-history-card,
.bk-history-empty,
.bk-empty {
  border-radius: 12px;
  box-shadow: 0 10px 28px rgba(15,23,42,.07);
}
html.dark .bk-card,
html.dark .bk-history-card,
html.dark .bk-history-empty,
html.dark .bk-empty,
.dark .bk-card,
.dark .bk-history-card,
.dark .bk-history-empty,
.dark .bk-empty {
  box-shadow: 0 12px 30px rgba(0,0,0,.28);
}
.bk-card-footer,
.bk-card-exemplaires {
  background: #f8fafc;
}
html.dark .bk-card-footer,
html.dark .bk-card-exemplaires,
.dark .bk-card-footer,
.dark .bk-card-exemplaires {
  background: rgba(15,23,42,.72);
}
.bk-history-card-title {
  padding: 16px 18px 4px;
  margin: 0;
  color: var(--bk-text);
}
.bk-history-table th {
  background: #f8fafc;
}
html.dark .bk-history-table th,
.dark .bk-history-table th {
  background: rgba(15,23,42,.72);
}
.bk-cat {
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(15,23,42,.04);
}
.bk-btn-details,
.bk-btn-online {
  border-radius: 9px;
}
.bk-settings-page {
  background: var(--bk-surface);
  border: 1px solid var(--bk-border);
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 10px 28px rgba(15,23,42,.07);
}
html.dark .bk-settings-page,
.dark .bk-settings-page {
  box-shadow: 0 12px 30px rgba(0,0,0,.28);
}

@media (max-width: 768px) {
  .bk-layout { flex-direction: column; }

  .bk-hamburger { display: inline-flex; }

  .bk-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 82%;
    max-width: 320px;
    transform: translateX(-110%);
    z-index: 30;
    box-shadow: 12px 0 34px rgba(0,0,0,.18);
    overflow-y: auto;
    border-right: none;
    background: var(--bk-surface);
    height: 100vh;
  }

  .bk-sidebar.open {
    transform: translateX(0);
  }

  .bk-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(15,23,42,.45);
    z-index: 25;
  }

  .bk-brand {
    padding: 14px 16px;
  }

  .bk-nav-section {
    display: none;
  }

  .bk-nav-item {
    width: 100%;
    min-width: 0;
    margin: 0;
  }

  .bk-sidebar-bottom {
    display: none;
  }

  .bk-main {
    position: relative;
    z-index: 1;
  }

  .bk-topbar {
    padding: 14px 16px;
  }

  .bk-search-box {
    width: 100%;
  }

  .bk-content { padding: 16px; }
}
`;
 
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
 
/* ── Initiales ── */
function initials(user) {
  if (!user) return '?';
  const n = (user.prenom || user.nom || user.username || '');
  return n.slice(0,2).toUpperCase() || '?';
}
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR');
}
function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('fr-FR');
}
 
/* ══════════════════════════════
   COMPOSANT COUVERTURE LOCALE
══════════════════════════════ */
/* ══════════════════════════════
   CARTE LIVRE LOCAL
══════════════════════════════ */
function LocalBookCard({ book, idx, onDetailsClick }) {
  const available = Number(book.exemplaires_disponibles ?? 0);
  const total = Number(book.total_exemplaires ?? 0);
  const isAvailable = available > 0;
  const summary = book.resume || book.description || '';
  const etat = book.etat || (isAvailable ? 'disponible' : 'indisponible');

  return (
    <div className="bk-card" onClick={() => onDetailsClick(book)}>
      <GenericBookCover book={book} index={idx} size="normal" />
      <div className="bk-body">
        {(book.genre || book.theme) && (
          <span className="bk-card-genre">🏷 {book.genre || book.theme}</span>
        )}
        <p className="bk-card-title">{book.titre}</p>
        <p className="bk-card-author">
          {book.auteur || <em style={{color:'#94a3b8'}}>Auteur inconnu</em>}
        </p>
        <div className="bk-card-meta">
          {book.code               && <span>Code: {book.code}</span>}
          {book.annee_publication && <span>📅 {book.annee_publication}</span>}
          {book.emplacement        && <span>📍 {book.emplacement}</span>}
          {book.langue             && <span>Langue: {book.langue}</span>}
          {book.nombre_pages       && <span>{book.nombre_pages} p.</span>}
        </div>

        <div className="bk-card-info-grid">
          <span className="bk-card-info">
            <span className="bk-card-info-label">Editeur</span>
            <span className="bk-card-info-value">{book.editeur || 'Non renseigne'}</span>
          </span>
          <span className="bk-card-info">
            <span className="bk-card-info-label">Type</span>
            <span className="bk-card-info-value">{book.type_ouvrage || 'Livre'}</span>
          </span>
        </div>

        <div className="bk-card-status">
          <span className={`bk-status-pill ${isAvailable ? 'ok' : 'bad'}`}>
            {isAvailable ? 'Disponible' : 'Indisponible'}
          </span>
          <span className={`bk-status-pill ${etat === 'disponible' ? 'ok' : 'warn'}`}>
            {etat}
          </span>
        </div>

        {summary && <p className="bk-card-summary">{summary}</p>}

        <div className="bk-card-exemplaires">
          <span className="bk-card-ex-label">📦 Exemplaires</span>
          <span className="bk-card-ex-val">
            {available}/{total}
          </span>
        </div>
      </div>
      <div className="bk-card-footer">
        <button
          className="bk-btn-details"
          onClick={(e) => {
            e.stopPropagation();
            onDetailsClick(book);
          }}
        >
          Lire les détails
        </button>
      </div>
    </div>
  );
}
 
/* ══════════════════════════════
   CARTE LIVRE EN LIGNE
══════════════════════════════ */
function OnlineBookCard({ book }) {
  const authors  = book.author_name ? book.author_name.slice(0,2).join(', ') : 'Auteur inconnu';
  const subjects = book.subject     ? book.subject.slice(0,2).join(' · ')    : '';
  const olKey    = book.key         ? `https://openlibrary.org${book.key}`   : '#';
 
  return (
    <div className="bk-card">
      <OnlineBookCover book={book} />
      <div className="bk-body">
        {subjects && (
          <span className="bk-card-genre" style={{background:'#ede9fe',color:'#6d28d9',borderColor:'#c4b5fd'}}>
            {subjects.split(' · ')[0]}
          </span>
        )}
        <p className="bk-card-title">{book.title}</p>
        <p className="bk-card-author">{authors}</p>
        <div className="bk-card-meta">
          {book.first_publish_year && <span>📅 {book.first_publish_year}</span>}
          {book.number_of_pages_median && (
            <span>📄 {book.number_of_pages_median} p.</span>
          )}
        </div>
        {book.ratings_average && (
          <div className="bk-card-meta">
            <span>⭐ {book.ratings_average.toFixed(1)} / 5</span>
          </div>
        )}
      </div>
      <div className="bk-card-footer">
        <a
          className="bk-btn-online"
          href={olKey}
          target="_blank"
          rel="noopener noreferrer"
        >
          🌐 Lire sur OpenLibrary
        </a>
      </div>
    </div>
  );
}
 
/* ══════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════ */
const CATEGORIES = [
  { key:'informatique', label:'💻 Informatique' },
  { key:'sante',        label:'🏥 Santé' },
  { key:'droit',        label:'⚖️ Droit' },
  { key:'education',    label:'🎓 Éducation' },
  { key:'roman',        label:'📖 Roman' },
  { key:'science',      label:'🔬 Science' },
  { key:'histoire',     label:'🏛 Histoire' },
  { key:'philosophie',  label:'💡 Philosophie' },
];
 
export default function Books() {
  const { t } = useTranslation();
 
  /* ── State ── */
  const [page,          setPage]          = useState('local');   // 'local' | 'online' | 'history' | 'settings'
  const [localBooks,    setLocalBooks]    = useState([]);
  const [onlineBooks,   setOnlineBooks]   = useState([]);
  const [query,         setQuery]         = useState('');
  const [category,      setCategory]      = useState('informatique');
  const [loading,       setLoading]       = useState(false);
  const [onlineLoading, setOnlineLoading] = useState(false);
  const [user,          setUser]          = useState(null);
  const [selectedBook,  setSelectedBook]  = useState(null);
  const [readerProfile, setReaderProfile] = useState(null);
  const [readerLoans,   setReaderLoans]   = useState([]);
  const [readerConsultations, setReaderConsultations] = useState([]);
  const [readerLoading, setReaderLoading] = useState(false);
  const [readerError,   setReaderError]   = useState('');
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [theme,         setTheme]         = useState('light');
  const [sidebarOpen,   setSidebarOpen]   = useState(false);

  const toggleSidebar = () => setSidebarOpen(open => !open);
  const closeSidebar = () => setSidebarOpen(false);
  const handlePageChange = (target) => {
    setPage(target);
    setSidebarOpen(false);
  };
 
  injectCSS('bk-css', CSS);
 
  /* ── Chargement initial ── */
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(u);
    fetchLocal('');
    
    // Charger le thème au démarrage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  /* ── Gérer les changements de thème ── */
  useEffect(() => {
    const handleThemeChange = (e) => {
      const newTheme = e.detail?.theme || 'light';
      setTheme(newTheme);
      applyTheme(newTheme);
    };

    window.addEventListener('app-theme-change', handleThemeChange);
    return () => window.removeEventListener('app-theme-change', handleThemeChange);
  }, []);

  function applyTheme(themeMode) {
    const html = document.documentElement;
    const layout = document.querySelector('.bk-layout');
    if (themeMode === 'dark') html.classList.add('dark');
    else html.classList.remove('dark');

    if (layout) {
      if (themeMode === 'dark') {
        layout.classList.add('dark');
      } else {
        layout.classList.remove('dark');
      }
    }
  }
 
  const loadReaderHistory = useCallback(async () => {
    if (!user) return;
    setReaderLoading(true);
    setReaderError('');

    try {
      const profileRes = await api.get('/readers/me');
      const profile = profileRes.data;
      setReaderProfile(profile || null);

      if (!profile?.id) {
        setReaderError('Impossible de localiser votre fiche lecteur.');
        return;
      }

      const [loansRes, consultationsRes] = await Promise.all([
        api.get(`/readers/${profile.id}/loans`).catch(() => ({ data: [] })),
        api.get(`/readers/${profile.id}/consultations`).catch(() => ({ data: [] }))
      ]);

      setReaderLoans(loansRes.data || []);
      setReaderConsultations(consultationsRes.data || []);
    } catch (err) {
      setReaderError(err?.response?.data?.error || err?.response?.data?.message || err.message || 'Impossible de charger votre historique');
    } finally {
      setReaderLoading(false);
      setHistoryLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (!user || page !== 'history' || historyLoaded) return;
    loadReaderHistory();
  }, [user, page, historyLoaded, loadReaderHistory]);
 
  /* ── Livres locaux ── */
  async function fetchLocal(q) {
    setLoading(true);
    try {
      const res = await api.get('/books', { params: { q } });
      setLocalBooks(res.data || []);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }
 
  /* ── Livres en ligne OpenLibrary ── */
  const fetchOnline = useCallback(async (subject) => {
    setOnlineLoading(true);
    setOnlineBooks([]);
    try {
      const term = encodeURIComponent(`subject:${subject}`);
      const url  = `https://openlibrary.org/search.json?q=${term}&has_fulltext=true&limit=24&fields=key,title,author_name,cover_i,first_publish_year,subject,number_of_pages_median,ratings_average`;
      const res  = await fetch(url);
      const data = await res.json();
      setOnlineBooks(data.docs || []);
    } catch (e) {
      console.error(e);
    } finally { setOnlineLoading(false); }
  }, []);
 
  /* ── Changement de catégorie ── */
  function selectCategory(cat) {
    setCategory(cat);
    fetchOnline(cat);
  }
 
  /* ── Passage en mode en ligne ── */
  function goOnline() {
    setPage('online');
    setSidebarOpen(false);
    if (onlineBooks.length === 0) fetchOnline(category);
  }
 
  /* ── Recherche locale ── */
  function handleSearch(e) {
    e.preventDefault();
    fetchLocal(query);
  }
 
  /* ── Déconnexion ── */
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location = '/';
  }
 
  const totalDispos   = localBooks.filter(b => (b.exemplaires_disponibles ?? 0) > 0).length;
  const totalIndispos = localBooks.filter(b => (b.exemplaires_disponibles ?? 0) === 0).length;
 
  /* ════════════ RENDER ════════════ */
  return (
    <div className="bk-layout">
 
      {/* ══ SIDEBAR ══ */}
      <aside className={`bk-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="bk-brand">
          <div className="bk-brand-icon">📚</div>
          <div>
            <div className="bk-brand-name">Biblio UAC</div>
            <div className="bk-brand-sub">Espace lecteur</div>
          </div>
        </div>
 
        <div className="bk-nav-section">{t('Catalogue')}</div>
 
        <button
          className={`bk-nav-item${page === 'local' ? ' active' : ''}`}
          onClick={() => handlePageChange('local')}
        >
          <span className="bk-nav-icon">📚</span>
          {t('Livres locaux')}
          <span className="bk-nav-badge">{localBooks.length}</span>
        </button>
 
        <button
          className={`bk-nav-item${page === 'online' ? ' active' : ''}`}
          onClick={goOnline}
        >
          <span className="bk-nav-icon">🌐</span>
          {t('Livres en ligne')}
        </button>
        <button
          className={`bk-nav-item${page === 'history' ? ' active' : ''}`}
          onClick={() => handlePageChange('history')}
        >
          <span className="bk-nav-icon">🕑</span>
          {t('Mon historique')}
        </button>
 
        <div className="bk-nav-section">{t('Compte')}</div>

        <button
          className={`bk-nav-item${page === 'settings' ? ' active' : ''}`}
          onClick={() => handlePageChange('settings')}
        >
          <span className="bk-nav-icon">⚙️</span>
          {t('Paramètres')}
        </button>

        <button className="bk-nav-item bk-nav-danger" onClick={logout}>
          <span className="bk-nav-icon">↪</span>
          {t('Déconnexion')}
        </button>

        <div className="bk-sidebar-bottom">
          <div className="bk-user-row">
            <div className="bk-avatar-sm">{initials(user)}</div>
            <div>
              <div className="bk-user-name">{user?.nom || user?.username || 'Lecteur'}</div>
              <div className="bk-user-role">{t('Lecteur')}</div>
            </div>
          </div>
          {/* Ancien raccourci de bas de menu remplace par les entrees Compte.
          <div style={{display:'flex', gap:8, marginTop:10}}>
            <button className="bk-logout-btn" onClick={() => setPage('settings')}>
              ⚙️ {t('Paramètres')}
            </button>
            <button className="bk-logout-btn" onClick={logout}>
              🚪 {t('Déconnexion')}
            </button>
          </div> */}
        </div>
      </aside>
 
      {/* ══ CONTENU PRINCIPAL ══ */}
      {sidebarOpen && <div className="bk-backdrop" onClick={closeSidebar} />}
      <div className="bk-main">
 
        {/* Topbar */}
        <div className="bk-topbar">
          <button className="bk-hamburger" onClick={toggleSidebar} type="button" aria-label="Menu">
            ☰
          </button>
          <h1>
            {page === 'local'  && t('Catalogue des ouvrages')}
            {page === 'online' && t('Livres gratuits en ligne')}
            {page === 'history' && t('Mon historique')}
            {page === 'settings' && t('Paramètres')}
          </h1>
        </div>
 
        <div className="bk-content">
 
          {/* ══ PAGE LIVRES LOCAUX ══ */}
          {page === 'history' && (
            <>
              {readerLoading ? (
                <div className="bk-loading">
                  <div className="bk-spinner"/>
                  <p style={{ margin: 0, fontSize: '.85rem' }}>{t('Chargement de votre historique...')}</p>
                </div>
              ) : readerError ? (
                <div className="bk-empty">
                  <div className="bk-empty-icon">⚠️</div>
                  <h3>{t('Impossible de charger l’historique')}</h3>
                  <p>{readerError}</p>
                </div>
              ) : !readerProfile ? (
                <div className="bk-empty">
                  <div className="bk-empty-icon">👤</div>
                  <h3>{t('Aucune fiche lecteur trouvée')}</h3>
                  <p>{t('Vérifiez que votre compte lecteur est correct ou contactez un bibliothécaire.')}</p>
                </div>
              ) : (
                <>
                  <div className="bk-stats">
                    <div className="bk-stat">
                      <div className="bk-stat-n">{readerLoans.length}</div>
                      <div className="bk-stat-l">{t('Emprunts')}</div>
                    </div>
                    <div className="bk-stat ok">
                      <div className="bk-stat-n">{readerLoans.filter(l => !l.date_retour_effective).length}</div>
                      <div className="bk-stat-l">{t('En cours')}</div>
                    </div>
                    <div className="bk-stat bad">
                      <div className="bk-stat-n">{readerLoans.filter(l => !l.date_retour_effective && l.date_retour_prevue && new Date(l.date_retour_prevue) < new Date()).length}</div>
                      <div className="bk-stat-l">{t('En retard')}</div>
                    </div>
                    <div className="bk-stat">
                      <div className="bk-stat-n">{readerConsultations.length}</div>
                      <div className="bk-stat-l">{t('Consultations')}</div>
                    </div>
                  </div>

                  <div className="bk-history-card">
                    <div className="bk-history-card-title">{t('Mes emprunts')}</div>
                    {readerLoans.length === 0 ? (
                      <div className="bk-history-empty">
                        <p>{t('Vous n’avez aucun emprunt enregistré pour le moment.')}</p>
                      </div>
                    ) : (
                      <table className="bk-history-table">
                        <thead>
                          <tr>
                            <th>{t('Ouvrage')}</th>
                            <th>{t('Code')}</th>
                            <th>{t('Emprunt')}</th>
                            <th>{t('Retour prévu')}</th>
                            <th>{t('Statut')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {readerLoans.map((loan) => {
                            const bookTitle = loan.Book?.titre || loan.titre || '—';
                            const bookCode = loan.Book?.code || loan.code || '—';
                            const isLate = !loan.date_retour_effective && loan.date_retour_prevue && new Date(loan.date_retour_prevue) < new Date();
                            const status = loan.date_retour_effective
                              ? 'Retourné'
                              : isLate
                                ? 'En retard'
                                : 'En cours';
                            const statusClass = loan.date_retour_effective
                              ? 'ok'
                              : isLate
                                ? 'danger'
                                : 'warn';

                            return (
                              <tr key={loan.id}>
                                <td>{bookTitle}</td>
                                <td style={{ fontFamily: "'Courier New', monospace", fontSize: '.75rem' }}>{bookCode}</td>
                                <td>{formatDate(loan.date_emprunt)}</td>
                                <td>{formatDate(loan.date_retour_prevue)}</td>
                                <td>
                                  <span className={`bk-history-badge ${statusClass}`}>{status}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>

                  <div className="bk-history-card">
                    <div className="bk-history-card-title">{t('Mes consultations')}</div>
                    {readerConsultations.length === 0 ? (
                      <div className="bk-history-empty">
                        <p>{t('Vous n’avez aucune consultation enregistrée pour le moment.')}</p>
                      </div>
                    ) : (
                      <table className="bk-history-table">
                        <thead>
                          <tr>
                            <th>{t('Ouvrage')}</th>
                            <th>{t('Code')}</th>
                            <th>{t('Début')}</th>
                            <th>{t('Fin')}</th>
                            <th>{t('Durée')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {readerConsultations.map((item) => {
                            const bookTitle = item.Book?.titre || item.titre || '—';
                            const bookCode = item.Book?.code || item.code || '—';
                            const start = item.heure_debut || item.date_debut || item.createdAt;
                            const end = item.heure_fin || item.date_fin;
                            const duration = start && end
                              ? `${Math.max(0, Math.round((new Date(end) - new Date(start)) / 60000))} min`
                              : '—';

                            return (
                              <tr key={item.id}>
                                <td>{bookTitle}</td>
                                <td style={{ fontFamily: "'Courier New', monospace", fontSize: '.75rem' }}>{bookCode}</td>
                                <td>{formatDateTime(start)}</td>
                                <td>{formatDateTime(end)}</td>
                                <td>{duration}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {page === 'settings' && (
            <div className="bk-settings-page">
              <SettingsPanel />
            </div>
          )}

          {page === 'local' && (
            <BooksPanel readOnly />
          )}
 
          {/* ══ PAGE LIVRES EN LIGNE ══ */}
          {page === 'online' && (
            <>
              {/* Filtres catégories */}
              <div className="bk-cats">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    className={`bk-cat${category === cat.key ? ' active' : ''}`}
                    onClick={() => selectCategory(cat.key)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
 
              {onlineLoading ? (
                <div className="bk-loading">
                  <div className="bk-spinner"/>
                  <p style={{margin:0, fontSize:'.85rem'}}>
                    {t('Chargement depuis OpenLibrary...')}
                  </p>
                </div>
              ) : onlineBooks.length === 0 ? (
                <div className="bk-empty">
                  <div className="bk-empty-icon">🌐</div>
                  <h3>{t('Aucun livre trouvé')}</h3>
                  <p>{t('Sélectionnez une catégorie ci-dessus')}</p>
                </div>
              ) : (
                <>
                  <div className="bk-section-label">
                    🌐 {onlineBooks.length} {t('livres gratuits')} · {
                      CATEGORIES.find(c => c.key === category)?.label || category
                    }
                  </div>
                  <div className="bk-grid">
                    {onlineBooks.map((book, idx) => (
                      <OnlineBookCard key={book.key || idx} book={book}/>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
 
        </div>
      </div>

      {/* MODAL DETAILS */}
      {selectedBook && (
        <BookDetailsPanel
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}
